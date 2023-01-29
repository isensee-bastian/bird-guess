import './BirdCard.css';

import React from 'react';
import { useIonAlert, useIonToast, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';


interface BirdCardProps {
    imgFile: string,
    name: string,
}

const BirdCard: React.FC<BirdCardProps> = ({ imgFile, name }) => {
    const [presentAlert] = useIonAlert();
    const [presentToast] = useIonToast();

    const showToast = (correct: boolean) => {
        presentToast({
            message: correct ? 'Correct answer!' : 'Wrong answer...',
            duration: 2000,
            position: 'bottom',
            color: correct ? 'success' : 'danger',
        });
    };

    const showConfirm = () => {
        presentAlert({
            header: name,
            message: `Are you guessing ${name}?`,
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        showToast(false);
                    },
                },
                {
                    text: 'Yes',
                    role: 'confirm',
                    handler: () => {
                        showToast(true);
                    },
                },
            ],
        })
    }

    return (
        <IonCard>
            <IonCardContent onClick={() => showConfirm()}>
                <img alt="Bird image" src={imgFile} />
            </IonCardContent>
        </IonCard >
    );
};

export default BirdCard;