import type { HumanAgent } from "./human";
import type { RandomAgent } from "./random";

import type { PersonaAgent } from "../ai/types";
export type Agent = HumanAgent | RandomAgent | PersonaAgent;
