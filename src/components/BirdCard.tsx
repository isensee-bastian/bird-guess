import './BirdCard.css';

import React from 'react';
import { useIonAlert, IonCard, IonCardContent, IonCardHeader, IonButton, IonCardTitle } from '@ionic/react';
import { Bird } from '../models/Meta';
import { join } from '../util/strconv';


interface BirdCardProps {
    dir: string;
    bird: Bird;
    onConfirm: (name: string) => void;
    onAttribution: () => void;
}

const BirdCard: React.FC<BirdCardProps> = ({ dir, bird, onConfirm, onAttribution }) => {
    const [presentAlert] = useIonAlert();

    const showConfirm = () => {
        presentAlert({
            header: bird.name,
            message: `Are you guessing ${bird.name}?`,
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                },
                {
                    text: 'Yes',
                    role: 'confirm',
                    handler: () => {
                        onConfirm(bird.name);
                    },
                },
            ],
        });
    };

    return (
        <IonCard className="bird-card" button={true} >
            <IonCardHeader>
                <IonCardTitle>{bird.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="bird-content" onClick={() => showConfirm()}>
                <img className="bird-image" alt={bird.name} src={join(dir, bird.image.fileName)} />
            </IonCardContent>
            <IonButton size="small" fill="clear" color="medium" onClick={onAttribution}>
                Attribution
            </IonButton>
        </IonCard >
    );
};

export default BirdCard;