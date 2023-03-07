import { IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonPage, IonProgressBar, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import './BirdTab.css';
import { musicalNote } from 'ionicons/icons';
import BirdList from '../components/BirdList';
import { useEffect, useState } from 'react';
import { Bird } from '../models/Meta';
import AttributionModal from '../components/AttributionModal';
import { join } from '../util/strconv';

interface BirdTabProps {
  dir: string;
  first: Bird;
  second: Bird;
  correct: Bird;
  progress: number;
  score: number;
  onChosen: (name: string) => void;
}

const pauseSound = (sound: HTMLAudioElement | undefined) => {
  if (sound) {
    sound.pause();
  }
};

const playSound = (sound: HTMLAudioElement | undefined) => {
  if (sound && sound.paused) {
    sound.play();
  }
};

// Note: Autoplay of sounds is usually blocked in the browser.
// Required for release:
//   * Add more birds (consider fetching a list of 100 or 200 bird types as a solid basis).
//   * Solid testing, also on mobile.
//   * Check which license is needed, especially due to usage of media licenses.
//   * Add link / attribution to bird name source.
//   * Setup Play Store access and check what is needed for publishing.
//   * Create icon and screenshots / text etc. for store presence.
// Nice to have improvements:
//   * Check if there are still transpiled js files checked in and remove them from the repository.
//   * Consider using axios for fetching in scripts.
//   * Check scripts are not included in delivery (already exculded in tsconfig.json).
//   * Fill version in about card automatically.
//   * Consider renaming BirdTab to BirdList or something similar.
//   * Consider measuring time in additon to points (consider start and stop buttons).
//   * Check if there is a better alternative for having a "correct" field in BirdTabProps.
//   * Add error handling for sound playing.
//   * Consider refactoring state to objects.
//   * Consider harmonizing attribution format in terms of license (name vs link inconsistency).
const BirdTab: React.FC<BirdTabProps> = ({ dir, first, second, correct, progress, score, onChosen }) => {

  const [sound, setSound] = useState<HTMLAudioElement>();

  useEffect(() => {
    setSound((old) => {
      pauseSound(old);
      return new Audio(join(dir, correct.sound.fileName))
    });
  }, [correct.name, correct.sound.fileName, dir]);

  const [attributionOpen, setAttributionOpen] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol size='8'>
                <IonTitle>Bird Guessing</IonTitle>
              </IonCol>
              <IonCol size='4'>
                <IonTitle>Score: {score}</IonTitle>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonProgressBar value={progress}></IonProgressBar>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Bird Guessing</IonTitle>
          </IonToolbar>
        </IonHeader>

        <BirdList
          dir={dir}
          first={first}
          second={second}
          onConfirm={(name: string) => onChosen(name)}
          onAttribution={() => setAttributionOpen(true)}
        />

        <IonFab slot='fixed' vertical='bottom' horizontal='end'>
          <IonFabButton onClick={() => playSound(sound)}>
            <IonIcon icon={musicalNote}></IonIcon>
          </IonFabButton>
        </IonFab>

        <AttributionModal
          isOpen={attributionOpen}
          first={first}
          second={second}
          onClose={() => setAttributionOpen(false)}
        />

      </IonContent>
    </IonPage >
  );
};

export default BirdTab;
