import React from "react";
import ReactDOM from "react-dom";
import CryptoJS from 'crypto-js';
import {combine, createEvent, createStore, guard, sample} from "effector";
import {useStore} from 'effector-react'

function encryptWithAES(password, text) {
  return CryptoJS.AES.encrypt(text, password).toString();
}

function decryptWithAES(password, text) {
  const bytes = CryptoJS.AES.decrypt(text, password);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const gameData = "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";

const $password = createStore("");
const passwordChanged = createEvent("passwordChanged");
$password.on(passwordChanged, (_, x) => x);

const $isCorrectPassword = $password.map(x => {
  try {
    const _ = JSON.parse(decryptWithAES(x, gameData));
    return true;
  } catch {
    return false;
  }
});

const $rounds = createStore([{question: "", answers: []}]);
$rounds.on(guard({source: $password, filter: $isCorrectPassword}), (_, password) => JSON.parse(decryptWithAES(password, gameData)));
$rounds.watch(x => console.info(x));

const $currentTeamId = createStore(0);
const currentTeamIdChanged = createEvent('currentTeamIdChanged');
$currentTeamId.on(currentTeamIdChanged, (x, _) => 1 - x);

const $currentRoundId = createStore(0);

const $hasNextRound = combine($currentRoundId, $rounds, (a, b) => a + 1 < b.length);

const nextRoundTriggered = createEvent('nextRoundTriggered');
$currentRoundId.on(
  guard({source: nextRoundTriggered, filter: $hasNextRound}),
  (x, _) => x + 1
);

const $question = combine($currentRoundId, $rounds, (a, b) => b[a].question);
const $questionAnswers = combine($currentRoundId, $rounds, (a, b) => b[a].answers);

const optionAnswered = createEvent('optionAnswered')

function teamStores(teamId) {
  const $name = createStore(`${teamId + 1}`)
  const $mistakes = createStore(0)
  const $score = createStore(0)
  const teamAnswered = guard({
    source: optionAnswered,
    filter: $currentTeamId.map(x => x === teamId),
  })
  const scoreEvent = sample($questionAnswers, teamAnswered, (answers, index) => {
    return index === -1 ? -1 : answers[index][1];
  });
  const currentTeamIdUpdated = createEvent('currentTeamIdUpdated');
  $currentTeamId.on(currentTeamIdUpdated, (a, _) => a === teamId ? -1 : teamId);
  
  $mistakes.on(scoreEvent, (x, update) => x + (update === -1 ? 1 : 0));
  $score.on(scoreEvent, (x, update) => x + (update === -1 ? 0 : update));
  $mistakes.on(nextRoundTriggered, (a, b) => 0);
  return {
    isCurrent: $currentTeamId.map(x => x === teamId),
    name: $name,
    mistakes: $mistakes,
    score: $score,
    currentTeamIdUpdated: currentTeamIdUpdated
  }
}

const $teams = [teamStores(0), teamStores(1)]
$currentTeamId.on(
  sample(combine($teams[0].mistakes, $teams[1].mistakes), optionAnswered),
  (prev, update) => {
    if (prev === -1) {
        return -1;
    }
    const next = 1 - prev
    if (update[next] === 3) {
      return prev
    }
    return next
  }
)

const $openedAnswers = createStore([]);
$openedAnswers.reset(nextRoundTriggered);
$openedAnswers.on(sample($currentTeamId, optionAnswered, (a, b) => [a, b]), (a, [team, update]) => [...a, [update, team]]);

const $answerPreviews = combine($questionAnswers, $openedAnswers, (a, b) => {
  return a.map((x, i) => {
        const item = b.filter(y => y[0] == i);
        if (item.length === 0) {
            return (
                <button class="text big" onClick={() => optionAnswered(i)}>
                    <span class="hint">{x[1]} очков</span>
                </button>
            );
        }
        return (
            <button class={`text big ${item[0][1] == 1 ? "first" : ""} ${item[0][1] == 0 ? "second" : ""}`} onClick={e => e.preventDefault()}>
                <span>{x[0]}</span>
            </button>
        );
  });
});

function TeamColumn({$team}) {
  const isCurrent = useStore($team.isCurrent)
  const name = useStore($team.name)
  const mistakes = useStore($team.mistakes)
  const score = useStore($team.score)
  return (
    <div>
      <div class="column">
        <div class={(isCurrent ? 'active' : '') + ' big team'} onClick={() => $team.currentTeamIdUpdated()}>Команда: {name}</div>
        {['', '', '']
          .map((_, i) => (i < mistakes ? 'X' : ''))
          .map(x => (
            <button class="red" onClick={() => optionAnswered(-1)}>
              {x}
            </button>
          ))}
        <div class="big">Очки: {score}</div>
      </div>
    </div>
  )
}

function App() {
  const previews = useStore($answerPreviews);
  const question = useStore($question);
  const hasNextRound = useStore($hasNextRound);
  const password = useStore($password);
  const isCorrectPassword = useStore($isCorrectPassword);
  return (
    <div>
      <center>
       <input type="password" placeholder="Введите пароль" value={password} onChange={e => passwordChanged(e.target.value)}/>
      </center>
      {isCorrectPassword && <div class="game">
        <h1>Вопрос: {question}</h1>
        <div class="wrapper">
          <TeamColumn $team={$teams[0]}/>
          <div class="column">
            {previews.map((x, i) => x)}
          </div>
          <TeamColumn $team={$teams[1]}/>
        </div>
        <button disabled={!hasNextRound} class="next big"
                onClick={() => nextRoundTriggered()}>Следующий раунд
        </button>
      </div>
      }
    </div>
  );
}

/* Function to add style element */

function addStyle(styles) {
  /* Create style document */

  var css = document.createElement('style')
  css.type = 'text/css'

  if (css.styleSheet) css.styleSheet.cssText = styles
  else css.appendChild(document.createTextNode(styles))

  /* Append style to the tag name */

  document.getElementsByTagName('head')[0].appendChild(css)
}

addStyle(`
		.game {
			display: flex;
			flex-flow: column;
			align-items: center;
			width: 100%;
            margin: 10% auto;
            max-width: 1000px;
		}	
		.wrapper {
			display:flex;
			flex-flow: row;
			align-items: center;
			justify-content: space-around;
			width: 100%;
		}
		.red {
			display: block;
			border: 0px;
			margin-bottom: 20px;
			width: 50px;
			height: 50px;
			background-color: rgb(216, 71, 42);
			border-radius: 5px;
			color: white;
			font-size: 20pt;
		}
		.column {
			display: flex;
			flex-flow: column;
			align-items: center;
		}
		.column div {
			margin-bottom: 20px;
		}
		.text {
			border: 0px;
			cursor: pointer;
			margin-bottom: 10px;
			display: block;
			height: 60px;
			line-height: 40px;
			vertical-align: middle;
			width: 500px;
			text-align: center;
			background-color: rgb(254, 202, 67);
			border-radius: 5px;
		}
		.next {
			border: 0px;
			cursor: pointer;
			margin-top: 50px;
			display: block;
			height: 60px;
			line-height: 40px;
			vertical-align: middle;
			width: 500px;
			text-align: center;
			background-color: lightgray;
			border-radius: 5px;
		}
		.hint {
			opacity: 0.2;
		}
		.next:disabled {
			opacity: 0.5;
		}
		.text:hover {
			background-color: rgb(254, 232, 67);
		}
		.team {
			padding: 10px;
			border: 2px solid white;
		}
		.team:hover {
			cursor: pointer;
		}
		.active {
			border: 2px solid gray;
			border-radius: 10px;
		}
		.big {
			font-size: 20pt;
		}
        .first {
            border-left: 10px solid green;
        }
        .second {
            border-right: 10px solid green;
        }
`)
ReactDOM.render(<App />, document.getElementById('root'))
