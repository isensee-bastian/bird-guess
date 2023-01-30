import './ScoreCard.css';

import { IonCard, IonCardHeader, IonCardTitle } from "@ionic/react";


interface ScoreCardProps {
    score: number,
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
    return (
        <IonCard className='score-card'>
            <IonCardHeader>
                <IonCardTitle>Score: {score}</IonCardTitle>
            </IonCardHeader>
        </IonCard >
    );
};

export default ScoreCard;