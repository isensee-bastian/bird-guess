import './BirdGrid.css';

import { IonItem, IonList } from "@ionic/react";
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
        <div className='wrapper'>
            <IonList lines='none'>
                <IonItem>
                    <BirdCard dir={dir} bird={first} onConfirm={() => onConfirm(first.name)} onAttribution={onAttribution} />
                </IonItem>
                <IonItem>
                    <BirdCard dir={dir} bird={second} onConfirm={() => onConfirm(second.name)} onAttribution={onAttribution} />
                </IonItem>
                <IonItem>
                    <ScoreCard score={score} />
                </IonItem>
            </IonList>
        </div>

    );
};

export default BirdGrid;