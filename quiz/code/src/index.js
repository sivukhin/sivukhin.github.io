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

const gameData = "U2FsdGVkX1/49Kn+m09pkRlW8JJ+wwSbO69zy3TIDkaOgd0PX/OOtI81cmFKLMlFv6YpjYfs3pGUA1aBmyZIvjpPvKtMNuHAey7T/fMPmc53Yr7ypSqoC6VVhvZGvqTl/UVw+KJ1Rmv6GBGpme4ebVbH6nSL+rR7sB12PVPTnRlSlUqqgbAi8RPZ7hIDfcGjAurhSD8DwXVZKyVI/us+rzW3a9O3f3yTaZqrm0ihXoqEg3nT4408/lmihK3N1nUN3Y6PlWGTnuZyonOZxv465o1jAK1C0wEIDif/Olzgk/WjP/ja3TqiYH0OknG/PtWUKss4Wx6UoHWT4Pbax59GH+WOabAHpvk9VE+AWfPva9101V8L7sSCk6RPjO/D+tBDPJAl4+GfLYhVPvBlveOoDGaKoI95UeEzW8ul+3w3vX7ABoPvGDJsUNZWmISegJpMnd4/v6polCErDuyB7000uERsGVcBty5tLxoybvQ0KRGf1dOrVWWEIVaQUKwaQUIfixbz6+A5XDzo6qFx4Kqy8CyHVmS4xw3Mv8JjPPf7F6IjF1do1H9PwDEbypmJYBlv+h3cbtCE0VCPadxX4ra/idovaYyZM0u+SVmBE4jW1bLmWszuvDrgQ3NxwftsJWhBgQU2UG1FxC49/aQaMFqaEyEbX37tlfWhdkljQbSKLcLMQ7i1ECndBUCx2O8JycMWJgBx4AIC5YQeMY6eh5FjVZfEKhxK8Tvpt83UOKTCXBgd2iFYByPHRQx8+Lux5qurG8JS1IKcU/KUTZHqUFoTlm8L3YC2ck4pp2DwpZCPrMKV8F5Md9rfYNaT4WPFUyb9+f0qWxyg00H+5IpaEd+gxB0xeSGWjrJ5Cv1ywmrVnuymrUbF2+vcXiA9UMhB5UDbcZB2e+GtlBdYfjq6tSZUq9K9TB635FfpYLIlVKB0pr6l5ozMVxJ9KvaqIBo/JHII30lMcNiv4OoZF6T6umIebA==";

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
  $currentTeamId.on(currentTeamIdUpdated, (a, b) => teamId);
  
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
    const next = 1 - prev
    if (update[next] === 3) {
      return prev
    }
    return next
  }
)

const $openedAnswers = createStore([]);
$openedAnswers.reset(nextRoundTriggered);
$openedAnswers.on(optionAnswered, (a, b) => [...new Set([...a, b])]);

const $answerPreviews = combine($questionAnswers, $openedAnswers, (a, b) => {
  return a.map((x, i) => b.includes(i) ? 
               (
    						<button class="text big" onClick={e => e.preventDefault()}>
    							<span>{x[0]}</span>
      					</button>
  							) : (
    						<button class="text big" onClick={() => optionAnswered(i)}>
    							<span class="hint">{x[1]} очков</span>
      					</button>
  							)
              );
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
			margin-top: 10%;
			display: flex;
			flex-flow: column;
			align-items: center;
			width: 100%;
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
`)
ReactDOM.render(<App />, document.getElementById('root'))
