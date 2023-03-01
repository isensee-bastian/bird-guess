import { IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, getPlatforms } from '@ionic/react';
import './InfoTab.css';

interface InfoTabProps {
}

const InfoTab: React.FC<InfoTabProps> = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Info</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen className="ion-padding">
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Info</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>How to play</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p>
            Click the musical note button in the first tab. You will hear the sound of a bird.
            Guess which bird makes that sound by tapping on its picture. You get one point for
            each correct guess until 10 rounds have been played.
          </p>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Can't hear any sound?</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p>
            Make sure you are in a quiet place and that your device is not muted. Then press on
            the musical note button in the first tab and listen carefully. Turn the volume up
            if needed.
          </p>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>About the media authors</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p>
            Special thanks to all bird photographers and recordists who make their great work available
            for others. Pictures are taken from <a href='https://www.wikipedia.org/'>Wikipedia</a> and
            recordings from <a href='https://xeno-canto.org/'>xeno-canto</a>. Please click the attributions
            tab or attributions button below bird images for specific media authors, URLs and licenses.
          </p>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Give feedback</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p>
            If you enjoyed this game please rate it or write a short review to make it more visible.
            If you have cool ideas or encountered any issues please let us know too, so we can improve the app.
          </p>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>App Version</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p>Bird Guess v0.1.0 ({getPlatforms()})</p>
        </IonCardContent>
      </IonCard>

    </IonContent>
  </IonPage>
);

export default InfoTab;
