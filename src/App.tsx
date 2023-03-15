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
import { book, checkmarkOutline, closeOutline, dice, helpCircle } from 'ionicons/icons';
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
import InfoTab from './pages/InfoTab';
import { randomIndexArray, shuffle } from './util/random';

setupIonicReact();

const VERSION = '0.1.0';

const FILE_DIR = 'assets/birds/';

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
      setBirds(shuffle(allBirds));
      setCorrectOffsets(randomIndexArray(2, ROUNDS_COUNT));
    }
  }, [restart]);

  const [showSolutionToast] = useIonToast();
  const [showScoreAlert] = useIonAlert();

  const onChosen = (name: string) => {
    if (!birds || !correctOffsets) {
      // Shield against initial state loading not done yet.
      return;
    }

    const correctBird = birds[round * 2 + correctOffsets[round]];
    const correct: boolean = correctBird.name === name;
    const newScore = correct ? score + 1 : score;
    setScore(newScore);

    showSolutionToast({
      message: correct ? 'Correct answer!' : 'Wrong answer...',
      duration: 2000,
      position: 'bottom',
      color: correct ? 'success' : 'danger',
      icon: correct ? checkmarkOutline : closeOutline
    });

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
                  progress={(round + 1) / 10}
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
            <InfoTab version={VERSION} />
          </Route>
          <Route exact path="/tab3">
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
            <IonIcon icon={helpCircle} />
            <IonLabel>Info</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/tab3">
            <IonIcon icon={book} />
            <IonLabel>Attribution</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>);
};

export default App;
