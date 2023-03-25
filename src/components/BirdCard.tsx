import './BirdCard.css';

import React from 'react';
import { IonCard, IonCardContent, IonButton, IonIcon } from '@ionic/react';
import { Bird } from '../models/Meta';
import { join } from '../util/strconv';
import { informationCircleOutline } from 'ionicons/icons';


interface BirdCardProps {
    dir: string;
    bird: Bird;
    onChosen: (name: string) => void;
    onAttribution: () => void;
}

const BirdCard: React.FC<BirdCardProps> = ({ dir, bird, onChosen, onAttribution }) => {
    return (
        <IonCard className="bird-card" button={true}>
            <div onClick={() => onChosen(bird.name)}>
                <IonCardContent className="bird-content">
                    <img className="bird-image" alt={bird.name} src={join(dir, bird.image.fileName)} />
                </IonCardContent>
            </div>
            <IonButton size="small" fill="clear" color="medium" onClick={onAttribution}>
            <IonIcon slot="end" icon={informationCircleOutline}></IonIcon>
                {bird.name}
            </IonButton>
        </IonCard >
    );
};

export default BirdCard;