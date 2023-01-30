import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import './Tab1.css';
import { musicalNote } from 'ionicons/icons';
import BirdGrid from '../components/BirdGrid';
import { useEffect, useState } from 'react';

interface Bird {
  name: string,
  imgFile: string,
  soundFile: string,
}

// The first one is the correct one. Second will always be different.
interface BirdPair {
  firstIndex: number,
  secondIndex: number,
  correctIndex: number,
}

const filePrefix = 'assets/birds/'

const allBirds: Bird[] = [
  { name: 'Pileated Woodpecker', imgFile: 'pileated_woodpecker.jpg', soundFile: 'pileated_woodpecker.mp3' },
  { name: 'Northern Cardinal', imgFile: 'northern_cardinal.jpg', soundFile: 'northern_cardinal.mp3' },
  { name: 'Blue Jay', imgFile: 'blue_jay.jpg', soundFile: 'blue_jay.mp3' },
  { name: 'Black-browed Albatross', imgFile: 'black-browed_albatross.jpg', soundFile: 'black-browed_albatross.mp3' },
  { name: 'Peregrine Falcon', imgFile: 'peregrine_falcon.jpg', soundFile: 'peregrine_falcon.mp3' },
  { name: 'Short-eared Owl', imgFile: 'short-eared_owl.jpg', soundFile: 'short-eared_owl.mp3' },
];

// TODO: Attribute authors and license of images and sounds.
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

    return { firstIndex: first, secondIndex: second, correctIndex: correct };
  }

  const [pair, setPair] = useState(nextRandomPair());

  const playSound = () => {
    const sound = new Audio(`${filePrefix}${allBirds[pair.correctIndex].soundFile}`);
    sound.play();
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
          leftImgFile={`${filePrefix}${allBirds[pair.firstIndex].imgFile}`}
          rightImgFile={`${filePrefix}${allBirds[pair.secondIndex].imgFile}`}
          leftName={allBirds[pair.firstIndex].name}
          rightName={allBirds[pair.secondIndex].name}
          score={score}
          onConfirm={(name => handleResult(name))}
        />

        <IonFab slot='fixed' vertical='bottom' horizontal='center'>
          <IonFabButton onClick={() => playSound()}>
            <IonIcon icon={musicalNote}></IonIcon>
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
