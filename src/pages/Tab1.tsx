import { IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import BirdCard from '../components/BirdCard';
import { musicalNote } from 'ionicons/icons';

const Tab1: React.FC = () => {
  const playSound = () => {
    const sound = new Audio("assets/birds/pileated_woodpecker.mp3");
    sound.play();
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

        <IonFab slot='fixed' vertical='bottom' horizontal='center'>
          <IonFabButton onClick={() => playSound()}>
            <IonIcon icon={musicalNote}></IonIcon>
          </IonFabButton>
        </IonFab>

        <IonGrid>
          <IonRow>
            <IonCol>
              <BirdCard imgFile="assets/birds/pileated_woodpecker.jpg" name="Pileated Woodpecker" />
            </IonCol>
            <IonCol>
              <BirdCard imgFile="assets/birds/northern_cardinal.jpg" name="Northern Cardinal" />
            </IonCol>
          </IonRow>
        </IonGrid>

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
