import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import './Tab1.css';
import { musicalNote } from 'ionicons/icons';
import BirdGrid from '../components/BirdGrid';
import { useEffect, useState } from 'react';
import allBirds from '../birds.json';

// The first one is the correct one. Second will always be different.
interface BirdPair {
  firstIndex: number,
  secondIndex: number,
  correctIndex: number,
}

const FILE_DIR = 'assets/birds/'

// TODO: Attribute authors and license of images and sounds.
// TODO: Improve layout, e.g. for mobile show birds next to each other.
// TODO: Add a mechanism to prevent showing the same (correct) bird multiple times.
// TODO: Set fixed size of rounds (e.g. 10).
// TODO: Consider measuring time in additon to points (consider start and stop buttons).
// TODO: Add error handling for sound playing.
// TODO: Check why state is loaded multiple times initially.
// TODO: Remove debug output.
// TODO: Consider automatic playing of sound.
const Tab1: React.FC = () => {

  const nextRandomInt = (maxExclusive: number): number => {
    return Math.floor(Math.random() * (maxExclusive));
  };

  const nextRandomPair = (): BirdPair => {
    const first = nextRandomInt(allBirds.length);
    var second = nextRandomInt(allBirds.length);
    while (second === first) {
      second = nextRandomInt(allBirds.length);
    }
    const correct = nextRandomInt(2) === 0 ? first : second;
    const trap = correct === first ? second : first;

    console.log(`Correct is ${allBirds[correct].name}`);
    console.log(`Trap is ${allBirds[trap].name}`);

    return { firstIndex: first, secondIndex: second, correctIndex: correct };
  };

  const createSound = (pair: BirdPair): HTMLAudioElement => {
    console.log(`Create sound for ${allBirds[pair.correctIndex].name}`);
    return new Audio(`${FILE_DIR}${allBirds[pair.correctIndex].sound.fileName}`);
  };

  const [pair, setPair] = useState(() => {
    console.log(`useState(nextRandomPair())`);
    return nextRandomPair()
  });

  const [sound, setSound] = useState(() => {
    console.log(`useState(createSound())`);
    return createSound(pair);
  });

  useEffect(() => {
    console.log(`useEffect(setSound())`);
    setSound(createSound(pair));
  }, [pair]);

  const playSound = () => {
    console.log(`Play sound`);
    sound.play();
  };

  const pauseSound = () => {
    console.log(`Pause sound`);
    sound.pause();
  };

  const [presentToast] = useIonToast();
  const [score, setScore] = useState(0);

  const handleResult = (name: string) => {
    const correct: boolean = name === allBirds[pair.correctIndex].name;

    presentToast({
      message: correct ? 'Correct answer!' : 'Wrong answer...',
      duration: 2000,
      position: 'bottom',
      color: correct ? 'success' : 'danger',
    });

    if (correct) {
      setScore(score + 1);
    }

    pauseSound();
    setPair(nextRandomPair());
  };

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
          leftImgFile={`${FILE_DIR}${allBirds[pair.firstIndex].image.fileName}`}
          rightImgFile={`${FILE_DIR}${allBirds[pair.secondIndex].image.fileName}`}
          leftName={allBirds[pair.firstIndex].name}
          rightName={allBirds[pair.secondIndex].name}
          score={score}
          onConfirm={(name => handleResult(name))}
        />

        <IonFab slot='fixed' vertical='bottom' horizontal='end'>
          <IonFabButton onClick={() => playSound()}>
            <IonIcon icon={musicalNote}></IonIcon>
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
