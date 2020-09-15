import { AgentBase, AgentType } from "./interface";

export interface RandomAgent extends AgentBase{
    type: AgentType.RANDOM
}