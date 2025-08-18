import { connect } from "@tursodatabase/sync";
import { nanoid } from 'nanoid';
var db = null;
var canvas = document.getElementById('canvas');
const Speed = 800;
const Proximity = 10;
const Fps = 120;
function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
function move(x1, y1, x2, y2, duration) {
    let d = dist(x1, y1, x2, y2);
    if (d < 1e-6) {
        return [x1, y1];
    }
    let vx = (x2 - x1) / d * Math.min(d, duration * Speed);
    let vy = (y2 - y1) / d * Math.min(d, duration * Speed);
    return [x1 + vx, y1 + vy];
}
var pendingStartPoint = null;
var capturedPoint = null;
var mouse = null;
var rendering = false;
async function exec(sql) {
    while (rendering) {
        await new Promise(resolve => setTimeout(resolve, 1));
    }
    rendering = true;
    try {
        await db.exec(sql);
    }
    finally {
        rendering = false;
    }
}
async function query(sql) {
    while (rendering) {
        await new Promise(resolve => setTimeout(resolve, 1));
    }
    rendering = true;
    try {
        let result = await (await db.prepare(sql)).all();
        return result;
    }
    finally {
        rendering = false;
    }
}
async function render(duration) {
    if (db == null) {
        return;
    }
    rendering = true;
    for (const element of document.getElementsByClassName('element')) {
        element.classList.remove('active');
    }
    document.getElementById('pending')?.remove();
    if (pendingStartPoint != null && mouse != null) {
        let element = document.getElementById(`point-${pendingStartPoint}`);
        let x1 = parseInt(element.getAttribute('cx'));
        let y1 = parseInt(element.getAttribute('cy'));
        if (dist(x1, y1, mouse[0], mouse[1]) > Proximity) {
            let pending = document.createElementNS("http://www.w3.org/2000/svg", "line");
            pending.id = 'pending';
            pending.setAttribute('x1', `${x1}`);
            pending.setAttribute('y1', `${y1}`);
            pending.setAttribute('x2', `${mouse[0]}`);
            pending.setAttribute('y2', `${mouse[1]}`);
            pending.setAttribute('stroke', `black`);
            canvas?.prepend(pending);
        }
    }
    let edges = await (await db.prepare(`
      SELECT edges.*, a.x as x1, a.y as y1, b.x as x2, b.y as y2
      FROM edges 
      JOIN points a ON a.id = edges.a 
      JOIN points b ON b.id = edges.b
  `)).all();
    for (const edge of edges) {
        let id = `edge-${edge.id}`;
        let element = document.getElementById(id);
        if (element == null) {
            element = document.createElementNS("http://www.w3.org/2000/svg", "line");
            element.id = id;
            element.classList.add('element');
            element.classList.toggle(id);
            element.classList.toggle(`point-${edge.a}`);
            element.classList.toggle(`point-${edge.b}`);
            canvas.prepend(element);
        }
        else {
            let x1 = parseInt(element.getAttribute('x1'));
            let x2 = parseInt(element.getAttribute('x2'));
            let y1 = parseInt(element.getAttribute('y1'));
            let y2 = parseInt(element.getAttribute('y2'));
            if (edge.a != capturedPoint && edge.b != capturedPoint) {
                [edge.x1, edge.y1] = move(x1, y1, edge.x1, edge.y1, duration);
                [edge.x2, edge.y2] = move(x2, y2, edge.x2, edge.y2, duration);
            }
        }
        element.classList.add('active');
        element.setAttribute('x1', `${edge.x1}`);
        element.setAttribute('y1', `${edge.y1}`);
        element.setAttribute('x2', `${edge.x2}`);
        element.setAttribute('y2', `${edge.y2}`);
        element.setAttribute('stroke', `black`);
    }
    let points = await (await db.prepare(`SELECT * FROM points`)).all();
    for (const point of points) {
        let id = `point-${point.id}`;
        let element = document.getElementById(id);
        if (element == null) {
            element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            element.id = id;
            element.classList.add('element');
            element.classList.toggle(id);
            canvas.appendChild(element);
        }
        else {
            let x = parseInt(element.getAttribute('cx'));
            let y = parseInt(element.getAttribute('cy'));
            if (point.id != capturedPoint) {
                [point.x, point.y] = move(x, y, point.x, point.y, duration);
            }
        }
        element.classList.add('active');
        element.setAttribute('cx', `${point.x}`);
        element.setAttribute('cy', `${point.y}`);
        element.setAttribute('r', `${point.size}`);
        element.setAttribute('fill', point.color);
    }
    for (const element of document.getElementsByClassName('element')) {
        if (!element.classList.contains('active')) {
            element.remove();
        }
    }
}
async function sync() {
    try {
        await db.sync();
    }
    finally {
        setTimeout(sync, (1 + Math.random()) * 1000);
    }
}
async function init() {
    let local = await connect({
        path: ":memory:",
        url: `https://graph1-sivukhin.aws-eu-north-1.turso.io`,
        authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN,
        clientName: `turso-graph`
    });
    db = local;
    document.getElementById('status').innerText = 'ready';
    sync();
    setInterval(() => {
        if (rendering) {
            return;
        }
        render(1.0 / Fps).finally(() => rendering = false);
    }, 1000 / Fps);
    addEventListener("dblclick", async (event) => {
        let mouseX = event.pageX - canvas.getBoundingClientRect().x;
        let mouseY = event.pageY - canvas.getBoundingClientRect().y;
        await exec(`DELETE FROM points WHERE (x - ${mouseX})*(x - ${mouseX}) + (y - ${mouseY})*(y - ${mouseY}) <= size*size`);
    });
    addEventListener("click", async (event) => {
        if (pendingStartPoint != null) {
            return;
        }
        let mouseX = event.pageX - canvas.getBoundingClientRect().x;
        let mouseY = event.pageY - canvas.getBoundingClientRect().y;
        let rows = await query(`SELECT id FROM points WHERE (x - ${mouseX})*(x - ${mouseX}) + (y - ${mouseY})*(y - ${mouseY}) <= size*size`);
        if (rows.length == 0) {
            await exec(`INSERT INTO points VALUES ('${nanoid(8)}', ${mouseX}, ${mouseY}, 'lightcoral', 10)`);
        }
    });
    addEventListener("mousedown", async (event) => {
        let mouseX = event.pageX - canvas.getBoundingClientRect().x;
        let mouseY = event.pageY - canvas.getBoundingClientRect().y;
        let rows = await query(`SELECT id FROM points WHERE (x - ${mouseX})*(x - ${mouseX}) + (y - ${mouseY})*(y - ${mouseY}) <= size*size`);
        if (rows.length == 1) {
            pendingStartPoint = rows[0].id;
            mouse = [mouseX, mouseY];
        }
    });
    addEventListener('mouseup', async (event) => {
        if (pendingStartPoint == null) {
            return;
        }
        let mouseX = event.pageX - canvas.getBoundingClientRect().x;
        let mouseY = event.pageY - canvas.getBoundingClientRect().y;
        let rows = await query(`SELECT id FROM points WHERE (x - ${mouseX})*(x - ${mouseX}) + (y - ${mouseY})*(y - ${mouseY}) <= size*size`);
        if (rows.length == 0) {
            pendingStartPoint = null;
            return;
        }
        if (pendingStartPoint == rows[0].id) {
            capturedPoint = capturedPoint == null ? pendingStartPoint : null;
        }
        else {
            await exec(`INSERT INTO edges VALUES ('${nanoid(8)}', '${pendingStartPoint}', '${rows[0].id}')`);
        }
        pendingStartPoint = null;
    });
    addEventListener('mousemove', async (event) => {
        let mouseX = event.pageX - canvas.getBoundingClientRect().x;
        let mouseY = event.pageY - canvas.getBoundingClientRect().y;
        mouse = [mouseX, mouseY];
        if (capturedPoint != null) {
            await exec(`UPDATE points SET x = ${mouseX}, y = ${mouseY} WHERE id = '${capturedPoint}'`);
        }
    });
}
init();
