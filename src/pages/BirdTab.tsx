import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import './BirdTab.css';
import { musicalNote } from 'ionicons/icons';
import BirdGrid from '../components/BirdGrid';
import { useEffect, useState } from 'react';
import { Bird } from '../models/Meta';


// TODO: Check if there is a better alternative for having a correct field.
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
  pauseSound(sound);

  if (sound) {
    console.log(`Playing sound`);
    sound.play();
  }
};

// Note: Autoplay of sounds is usually blocked in the browser.
// TODO: Move state one layer up, i.e. calculate pairs in advance.
// TODO: Attribute authors and license of images and sounds.
// TODO: Improve layout, e.g. for mobile show birds next to each other.
// TODO: Add a mechanism to prevent showing the same (correct) bird multiple times.
// TODO: Set fixed size of rounds (e.g. 10).
// TODO: Consider measuring time in additon to points (consider start and stop buttons).
// TODO: Add error handling for sound playing.
// TODO: Check why state is loaded multiple times initially.
// TODO: Remove debug output.
// TODO: Consider automatic playing of sound.
// TODO: Consider using path join instead of string concatenation.
const BirdTab: React.FC<BirdTabProps> = ({ dir, first, second, correct, score, onChosen }) => {

  const [sound, setSound] = useState<HTMLAudioElement>();

  useEffect(() => {
    console.log(`Correct is: ${correct.name}`)

    pauseSound(sound);

    console.log(`Creating audio for: ${correct.sound.fileName}`);
    setSound(new Audio(`${dir}${correct.sound.fileName}`));
  }, [correct.name]);

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
          leftImgFile={`${dir}${first.image.fileName}`}
          rightImgFile={`${dir}${second.image.fileName}`}
          leftName={`${first.name}`}
          rightName={`${second.name}`}
          score={score}
          onConfirm={(name => onChosen(name))}
        />


        <IonFab slot='fixed' vertical='bottom' horizontal='end'>
          <IonFabButton onClick={() => playSound(sound)}>
            <IonIcon icon={musicalNote}></IonIcon>
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage >
  );
};

export default BirdTab;
