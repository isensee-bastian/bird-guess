import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './BirdTab.css';
import { musicalNote } from 'ionicons/icons';
import BirdGrid from '../components/BirdGrid';
import { useEffect, useState } from 'react';
import { Bird } from '../models/Meta';
import AttributionModal from '../components/AttributionModal';
import { join } from '../util/strconv';

interface BirdTabProps {
  dir: string;
  first: Bird;
  second: Bird;
  correct: Bird;
  score: number;
  onChosen: (name: string) => void;
}

const pauseSound = (sound: HTMLAudioElement | undefined) => {
  if (sound) {
    console.log(`Pausing sound`);
    sound.pause();
  }
};

const playSound = (sound: HTMLAudioElement | undefined) => {
  if (sound && sound.paused) {
    console.log(`Playing sound`);
    sound.play();
  }
};

// Note: Autoplay of sounds is usually blocked in the browser.
// Required for release:
//   * Improve layout, e.g. for mobile show birds next to each other.
//   * Add more birds.
//   * Convert bird images to smaller size in order to not bloat application size.
//   * Remove or disable debug output.
//   * Solid testing, also on mobile.
// Nice to have improvements:
//   * Consider measuring time in additon to points (consider start and stop buttons).
//   * Check if there is a better alternative for having a "correct" field in BirdTabProps.
//   * Add error handling for sound playing.
//   * Consider refactoring state to objects.
//   * Consider harmonizing attribution format in terms of license (name vs link inconsistency).
//   * Consider adding a help text.
const BirdTab: React.FC<BirdTabProps> = ({ dir, first, second, correct, score, onChosen }) => {

  const [sound, setSound] = useState<HTMLAudioElement>();

  useEffect(() => {
    console.log(`Correct is: ${correct.name}`)
    console.log(`Creating audio for: ${correct.sound.fileName}`);

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
          <IonTitle>Bird Guessing</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Bird Guessing</IonTitle>
          </IonToolbar>
        </IonHeader>

        <BirdGrid
          dir={dir}
          first={first}
          second={second}
          score={score}
          onConfirm={(name => onChosen(name))}
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
