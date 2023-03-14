import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonProgressBar } from '@ionic/react';
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
//   * Create screenshots and description for store.
//   * Setup Play Store access and check what is needed for publishing.
//   * Increase splash duration.
//   * Display score.
//   * In landscape layout show birds next to each other.
//   * Add attribution for icon / splash.
//   * Commit to github (select license), decide how to provide bird media files (due to different license).
// Nice to have improvements:
//   * Consider adding more birds if app size stays reasonable (check size reduction options, load attribution page entries lazily, check for accidental non-bird media, remove failed conversions).
//   * Consider evaluation text at the end depending on score.
//   * Consider using axios for fetching in scripts.
//   * Check scripts are not included in delivery (already exculded in tsconfig.json).
//   * Consider measuring time in additon to points (consider start and stop buttons).
//   * Check if there is a better alternative for having a "correct" field in BirdTabProps.
//   * Add error handling for sound playing.
//   * Consider refactoring state to objects.
//   * Consider harmonizing attribution format in terms of license (name vs link inconsistency).
const BirdTab: React.FC<BirdTabProps> = ({ dir, first, second, correct, progress, onChosen }) => {

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
      <IonContent>
        <IonHeader>
          <IonProgressBar value={progress}></IonProgressBar>
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
