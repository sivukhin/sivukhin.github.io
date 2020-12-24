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
