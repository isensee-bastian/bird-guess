import './BirdGrid.css';

import { IonCol, IonGrid, IonRow } from "@ionic/react";
import BirdCard from "./BirdCard";
import ScoreCard from "./ScoreCard";
import { Bird } from '../models/Meta';

interface BirdGridProps {
    dir: string;
    first: Bird;
    second: Bird;
    score: number;
    onConfirm: (name: string) => void;
    onAttribution: () => void;
}

const BirdGrid: React.FC<BirdGridProps> = ({ dir, first, second, score, onConfirm, onAttribution }) => {
    return (
        <IonGrid className="bird-grid" fixed={true}>
            <IonRow>
                <IonCol>
                    <BirdCard dir={dir} bird={first} onConfirm={() => onConfirm(first.name)} onAttribution={onAttribution} />
                </IonCol>
                <IonCol>
                    <BirdCard dir={dir} bird={second} onConfirm={() => onConfirm(second.name)} onAttribution={onAttribution} />
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