import { h } from "preact";
import { Card } from "../../shared/card";
import QueueCard from "./card/queueCard";
import { dispatchSwitchCardDisplayMode } from "../../game/dispatch";
import FullQueueCard from "./card/fullQueueCard";
import { dispatchDisplayEventHistory } from "../../events/dispatch";
import { GameState } from "../../game/interface";

interface Props {
  queue: Card[][][];
  player: number;
}

const selector = (state: GameState): Props => {
  const player = state.player;
  const opponent = state.player === 0 ? 1 : 0;
  let queue = state.queue.map(turnArr => {
    return [turnArr[opponent], turnArr[player]];
  });
  return { queue, player };
};

const board = (props: Props) => {
  const { queue = [], player } = props;
  return <div class="queue">{renderBoard(queue, player)}</div>;
};
const cardNames = (cards: Card[] = []) => {
  return cards.reduce((total, current) => total + "-" + current.id, "");
};
const cardPlayerKey = (cardsByPlayer: Card[][] = []) => {
  return cardsByPlayer.reduce((total, cards) => total + cardNames(cards), "");
};
const renderBoard = (queue: Card[][][] = [], identity: number) => {
  return queue.map((cardByPlayer = [], i) => {
    const key = cardPlayerKey(cardByPlayer);
    return (
      <div key={key} class="queue-turn">
        <div class="history-btn">
          <button onClick={() => dispatchDisplayEventHistory(i)}>H</button>
        </div>
        {cardByPlayer.map((cards, j) => {
          return cards.map((card, k) => {
            const opponent = card.player !== identity ? "opponent" : "";
            const shouldAnimate =
              (card.telegraphs && card.telegraphs.length > 0) ||
              (card.focuses && card.focuses.length > 0)
                ? "has-effects"
                : "";
            return (
              <div key={card.id}>
                <div
                  class={`text-center queue-card ${opponent} ${shouldAnimate}`}
                  onClick={() => dispatchSwitchCardDisplayMode(i, j, k)}
                >
                  <div class={card.showFullCard ? "" : "collapsed"}>
                    <FullQueueCard {...card} identity={identity} />
                  </div>
                  <div
                    class={(card.showFullCard ? "collapsed" : "") + " ongoing"}
                  >
                    <QueueCard {...card} identity={identity} />
                  </div>
                </div>
              </div>
            );
          });
        })}
      </div>
    );
  });
};

export default (state: GameState) => board(selector(state));
