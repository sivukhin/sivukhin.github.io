package main

import (
	"bytes"
	_ "embed"
	"encoding/binary"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"sort"
	"strings"
	"syscall"
	"text/template"
	"time"

	"github.com/sivukhin/godjot/djot_parser"
	"github.com/sivukhin/godjot/djot_tokenizer"
	"github.com/sivukhin/godjot/html_writer"
	"github.com/sivukhin/gopeg/highlight"
)

type Meta struct {
	Root, Author, BlogName string
}

type Article struct {
	Meta                             Meta
	Link, Title, Content, Desc, Date string
	Hide                             bool
}

type Articles struct {
	Meta     Meta
	Articles []Article
}

var (
	//go:embed templates/about.html
	aboutTemplateString string
	//go:embed templates/index.html
	indexTemplateString string
	//go:embed templates/index_all.html
	indexAllTemplateString string
	//go:embed templates/article.html
	articleTemplateString string
)

var (
	aboutTemplate    *template.Template
	indexTemplate    *template.Template
	indexAllTemplate *template.Template
	articleTemplate  *template.Template
)

func init() {
	var err error
	aboutTemplate, err = template.New("").Parse(aboutTemplateString)
	if err != nil {
		panic(err)
	}
	indexTemplate, err = template.New("").Parse(indexTemplateString)
	if err != nil {
		panic(err)
	}
	indexAllTemplate, err = template.New("").Parse(indexAllTemplateString)
	if err != nil {
		panic(err)
	}
	articleTemplate, err = template.New("").Parse(articleTemplateString)
	if err != nil {
		panic(err)
	}
}

func build(dir string, meta Meta) {
	log.Printf("build godjotblog: start at dir '%v'", dir)
	startTime := time.Now()
	articles := make([]Article, 0)
	err := filepath.Walk(dir, func(path string, info fs.FileInfo, err error) error {
		if info == nil || info.IsDir() {
			return nil
		}
		if !strings.HasSuffix(path, ".dj") {
			return nil
		}
		djot, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		ast := djot_parser.BuildDjotAst(djot)
		var date, title, desc, hide string
		for _, node := range ast {
			node.Traverse(func(node djot_parser.TreeNode[djot_parser.DjotNode]) {
				if node.Type != djot_parser.HeadingNode {
					return
				}
				if dateAttr, ok := node.Attributes.TryGet("date"); ok && date == "" {
					title = string(node.FullText())
					date = dateAttr
				}
				if descAttr, ok := node.Attributes.TryGet("desc"); ok && desc == "" {
					desc = descAttr
				}
				if hideAttr, ok := node.Attributes.TryGet("hide"); ok && hide == "" {
					hide = hideAttr
				}
			})
		}
		htmlPath := strings.TrimSuffix(path, ".dj") + ".html"
		f, err := os.OpenFile(htmlPath, os.O_CREATE|os.O_TRUNC|os.O_RDWR, 0660)
		if err != nil {
			return err
		}
		defer f.Close()
		link, err := filepath.Rel(dir, htmlPath)
		if err != nil {
			return err
		}
		content := djot_parser.NewConversionContext(
			"html",
			djot_parser.DefaultConversionRegistry,
			map[djot_parser.DjotNode]djot_parser.Conversion{
				djot_parser.CodeNode: func(state djot_parser.ConversionState, next func(c djot_parser.Children)) {
					code := string(state.Node.FullText())
					if state.Node.Attributes.Get(djot_tokenizer.CodeLangKey) == "python" {
						code, err = highlight.Highlight(code, highlight.PythonTokenizerRules)
					} else if state.Node.Attributes.Get(djot_tokenizer.CodeLangKey) == "c" {
						code, err = highlight.Highlight(code, highlight.CTokenizerRules)
					} else if state.Node.Attributes.Get(djot_tokenizer.CodeLangKey) == "rust" {
						code, err = highlight.Highlight(code, highlight.RustTokenizerRules)
					} else if state.Node.Attributes.Get(djot_tokenizer.CodeLangKey) == "shell" {
						code, err = highlight.Highlight(code, highlight.ShellTokenizerRules)
					} else if state.Node.Attributes.Get(djot_tokenizer.CodeLangKey) == "go" {
						code, err = highlight.Highlight(code, highlight.GoTokenizerRules)
					} else if state.Node.Attributes.Get(djot_tokenizer.CodeLangKey) == "asm" {
						code, err = highlight.Highlight(code, highlight.AsmTokenizerRules)
					} else if state.Node.Attributes.Get(djot_tokenizer.CodeLangKey) == "zig" {
						code, err = highlight.Highlight(code, highlight.ZigTokenizerRules)
					}
					if err != nil {
						panic(fmt.Errorf("unable to highlight code: %w", err))
					}
					state.Writer.InTag("pre", state.Node.Attributes.Entries()...)(func() {
						for _, line := range strings.Split(strings.TrimSpace(code), "\n") {
							state.Writer.OpenTag("code").WriteString(line).CloseTag("code").WriteString("\n")
						}
					}).WriteString("\n")
				},
				djot_parser.ImageNode: func(state djot_parser.ConversionState, next func(c djot_parser.Children)) {
					state.Writer.
						OpenTag("figure").
						OpenTag("img", state.Node.Attributes.Entries()...).
						OpenTag("figcaption").
						WriteString(state.Node.Attributes.Get(djot_parser.ImgAltKey)).
						CloseTag("figcaption").
						CloseTag("figure")
				},
			},
		).ConvertDjotToHtml(&html_writer.HtmlWriter{Indentation: 4, TabSize: 2}, ast...)
		article := Article{Link: link, Meta: meta, Title: title, Desc: desc, Date: date, Content: content, Hide: hide == "true"}
		articles = append(articles, article)
		return articleTemplate.Execute(f, article)
	})
	if err != nil {
		panic(err)
	}
	sort.Slice(articles, func(i, j int) bool { return articles[i].Date > articles[j].Date })

	renderFile := func(p string, tmpl *template.Template) {
		f, err := os.OpenFile(p, os.O_CREATE|os.O_TRUNC|os.O_RDWR, 0660)
		if err != nil {
			panic(err)
		}
		defer f.Close()
		err = tmpl.Execute(f, Articles{Meta: meta, Articles: articles})
		if err != nil {
			panic(err)
		}
	}
	renderFile(path.Join(dir, "index.html"), indexTemplate)
	renderFile(path.Join(dir, "index_all.html"), indexAllTemplate)
	renderFile(path.Join(dir, "about.html"), aboutTemplate)

	_ = filepath.WalkDir("content", func(p string, d fs.DirEntry, err error) error {
		if d == nil || d.IsDir() {
			return nil
		}
		data, err := os.ReadFile(p)
		if err != nil {
			panic(err)
		}
		targetPath := path.Join(dir, strings.TrimPrefix(p, "content/"))
		if _, err := os.Stat(path.Dir(targetPath)); os.IsNotExist(err) {
			err = os.Mkdir(path.Dir(targetPath), 0700)
			if err != nil {
				panic(err)
			}
		}
		f, err := os.OpenFile(targetPath, os.O_CREATE|os.O_TRUNC|os.O_RDWR, 0660)
		if err != nil {
			panic(err)
		}
		for len(data) > 0 {
			n, err := f.Write(data)
			if err != nil {
				panic(err)
			}
			data = data[n:]
		}
		_ = f.Close()
		return nil
	})
	log.Printf("build godjotblog: finish at dir '%v', elapsed=%v", dir, time.Since(startTime))
}

func inotify(id int, dir string) {
	err := filepath.WalkDir(dir, func(path string, d fs.DirEntry, err error) error {
		if !d.IsDir() {
			return nil
		}
		if d.Name()[0] == '.' && d.Name()[:2] != ".." {
			return fs.SkipDir
		}
		_, err = syscall.InotifyAddWatch(id, path, syscall.IN_CREATE|syscall.IN_DELETE|syscall.IN_MODIFY|syscall.IN_MOVE)
		return err
	})
	if err != nil {
		log.Fatal(err)
	}
}

func cstring(b []byte) string {
	i := 0
	for i < len(b) && b[i] != 0 {
		i++
	}
	return string(b[:i])
}

func watch(dir string, meta Meta) {
	build(dir, meta)

	id, err := syscall.InotifyInit()
	if err != nil {
		log.Fatal(err)
	}
	defer func() { _ = syscall.Close(id) }()
	var chunk [1024]byte
	for {
		inotify(id, dir)

		buf := make([]byte, 0, 128)
		for {
			n, err := syscall.Read(id, chunk[:])
			if err != nil {
				log.Fatal(err)
			}
			buf = append(buf, chunk[:n]...)
			if n < len(chunk) {
				break
			}
		}
		i := 0
		hasDjot := false
		for i < len(buf) {
			var event syscall.InotifyEvent
			err = binary.Read(bytes.NewReader(buf[i:i+4*4]), binary.LittleEndian, &event)
			if err != nil {
				log.Fatal(err)
			}
			name := cstring(buf[i+4*4:])
			i += 4*4 + int(event.Len)
			if strings.HasSuffix(name, ".dj") {
				hasDjot = true
			}
		}
		if hasDjot {
			build(dir, meta)
		}
	}
}

func serve(dir string, meta Meta) {
	go func() {
		http.Handle("/", http.FileServer(http.Dir(dir)))
		err := http.ListenAndServe(":8080", nil)
		if err != nil {
			log.Fatal(err)
		}
	}()
	watch(dir, meta)
}

func main() {
	var (
		dir    = flag.String("dir", "", "root directory for processing")
		root   = flag.String("root", "", "root HTML entry point")
		title  = flag.String("title", "", "blog title")
		author = flag.String("author", "", "blog author")
		mode   = flag.String("mode", "", "build|watch|serve")
	)
	flag.Parse()

	meta := Meta{BlogName: *title, Author: *author, Root: *root}
	if *mode == "build" {
		build(*dir, meta)
	} else if *mode == "serve" {
		serve(*dir, meta)
	} else if *mode == "watch" {
		watch(*dir, meta)
	}
}
