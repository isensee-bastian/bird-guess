import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonProgressBar } from '@ionic/react';
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
      <IonHeader>
        <IonProgressBar value={progress}></IonProgressBar>
      </IonHeader>

      <IonContent>
        <BirdGrid
          dir={dir}
          first={first}
          second={second}
          onChosen={(name: string) => onChosen(name)}
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
