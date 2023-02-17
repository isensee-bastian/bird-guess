import './BirdGrid.css';

import { IonCol, IonGrid, IonRow } from "@ionic/react";
import BirdCard from "./BirdCard";
import ScoreCard from "./ScoreCard";

interface BirdGridProps {
    leftImgFile: string,
    rightImgFile: string,
    leftName: string,
    rightName: string,
    score: number,
    onConfirm: (name: string) => void,
}

const BirdGrid: React.FC<BirdGridProps> = ({ leftImgFile, rightImgFile, leftName, rightName, score, onConfirm }) => {
    return (
        <IonGrid className="bird-grid" fixed={true}>
            <IonRow>
                <IonCol>
                    <BirdCard imgFile={leftImgFile} name={leftName} onConfirm={() => onConfirm(leftName)} />
                </IonCol>
                <IonCol>
                    <BirdCard imgFile={rightImgFile} name={rightName} onConfirm={() => onConfirm(rightName)} />
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <ScoreCard score={score} />
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

export default BirdGrid;