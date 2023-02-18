import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonProgressBar,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  useIonAlert,
  useIonToast
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { book, dice } from 'ionicons/icons';
import BirdTab from './pages/BirdTab';
import allBirds from './birds.json';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { Bird } from './models/Meta';
import AttributionsTab from './pages/AttributionsTab';

setupIonicReact();

// Fisher-Yates algorithm adapted from: https://bost.ocks.org/mike/shuffle/
function randomBirds(): Bird[] {
  const birds = allBirds.slice(0);

  let remaining = birds.length;
  while (remaining) {
    const random = randomInt(remaining);
    remaining -= 1;

    const temp = birds[remaining];
    birds[remaining] = birds[random];
    birds[random] = temp;
  }

  return birds;
}

function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

function randomIndexArray(maxExclusive: number, count: number): number[] {
  const result: number[] = [];

  for (let index = 0; index < count; index++) {
    result.push(randomInt(maxExclusive));
  }

  return result;
}

const FILE_DIR = 'assets/birds/'

// Note that the lenght of birds must be greater or equal to this number multiplied with
// the number of shown birds per round.
const ROUNDS_COUNT = 10;

const App: React.FC = () => {

  const [restart, setRestart] = useState(true);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [birds, setBirds] = useState<Bird[]>();
  // An array of 0 and 1 values representing the correct bird per round.
  const [correctOffsets, setCorrectOffsets] = useState<number[]>();

  useEffect(() => {
    if (restart) {
      setRestart(false);
      setRound(0);
      setScore(0);
      setBirds(randomBirds());
      setCorrectOffsets(randomIndexArray(2, ROUNDS_COUNT));
    }
  }, [restart]);

  const [showSolutionToast] = useIonToast();
  const [showScoreAlert] = useIonAlert();

  const onChosen = (name: string) => {
    if (!birds || !correctOffsets) {
      // Shield against initial state loading not done yet.
      console.log('onChosen - skip, state not initialized yet');
      return;
    }

    const correctBird = birds[round * 2 + correctOffsets[round]];
    console.log(`Chose ${name} and correct is ${correctBird.name}`);
    const correct: boolean = correctBird.name === name;

    showSolutionToast({
      message: correct ? 'Correct answer!' : 'Wrong answer...',
      duration: 2000,
      position: 'bottom',
      color: correct ? 'success' : 'danger',
    });

    const newScore = correct ? score + 1 : score;
    setScore(newScore);
    console.log(`Completed round ${round}`);

    if (round < ROUNDS_COUNT - 1) {
      setRound(round + 1);
    } else {
      showScoreAlert({
        header: 'Game completed',
        message: `You scored ${newScore} of ${ROUNDS_COUNT} points.`,
        buttons: ['OK'],
        onDidDismiss: (_: CustomEvent) => setRestart(true),
      });
      setRestart(false);
    }
  };

  const [showAttributionAlert] = useIonAlert();

  return (<IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/tab1">
            <>
              {birds && correctOffsets &&
                <BirdTab
                  dir={FILE_DIR}
                  first={birds[round * 2]}
                  second={birds[round * 2 + 1]}
                  correct={birds[round * 2 + correctOffsets[round]]}
                  score={score}
                  onChosen={(name) => onChosen(name)}
                />
              }
              {
                (!birds || !correctOffsets) &&
                <IonProgressBar type="indeterminate"></IonProgressBar>
              }
            </>
          </Route>
          <Route exact path="/tab2">
            <AttributionsTab birds={allBirds} />
          </Route>
          <Route exact path="/">
            <Redirect to="/tab1" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon icon={dice} />
            <IonLabel>Play</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon icon={book} />
            <IonLabel>Attribution</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>);
};

export default App;
