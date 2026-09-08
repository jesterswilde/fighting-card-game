window.VIZDEV_CARDS = [
  {
    "name": "_Buffer",
    "style": "Grappler",
    "priority": 3,
    "requirements": [],
    "effects": [
      {
        "axis": "Buff",
        "amount": 5
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "_BufferMix",
    "style": "Grappler",
    "priority": 3,
    "requirements": [],
    "effects": [
      {
        "axis": "Buff",
        "amount": 5
      },
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 3
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "_CripE1",
    "style": "Grappler",
    "priority": 5,
    "requirements": [],
    "effects": [
      {
        "axis": "Cripple",
        "detail": "Everything"
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "_CripE2",
    "style": "Grappler",
    "priority": 5,
    "requirements": [],
    "effects": [
      {
        "axis": "Cripple",
        "detail": "Everything"
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "_CripE3",
    "style": "Grappler",
    "priority": 5,
    "requirements": [],
    "effects": [
      {
        "axis": "Cripple",
        "detail": "Everything"
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "_CritOff",
    "style": "Grappler",
    "priority": 3,
    "requirements": [],
    "effects": [],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Prone",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 11
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "_CritOn",
    "style": "Grappler",
    "priority": 3,
    "requirements": [],
    "effects": [],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Standing",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 11
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "_EnhanceEnd",
    "style": "Grappler",
    "priority": 3,
    "requirements": [],
    "effects": [
      {
        "axis": "Damage",
        "player": "Both",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Enhance",
        "enhancedTag": "Leap",
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 5
          }
        ]
      }
    ],
    "tags": [
      "Leap"
    ]
  },
  {
    "name": "_EnhanceMid",
    "style": "Grappler",
    "priority": 3,
    "requirements": [],
    "effects": [
      {
        "axis": "Still",
        "player": "Both"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Enhance",
        "enhancedTag": "Leap",
        "effects": [
          {
            "axis": "Still",
            "player": "Both"
          }
        ]
      }
    ],
    "tags": [
      "Leap"
    ]
  },
  {
    "name": "_EnhanceStart",
    "style": "Grappler",
    "priority": 3,
    "requirements": [],
    "effects": [],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Enhance",
        "enhancedTag": "Leap",
        "effects": [
          {
            "axis": "Poise",
            "player": "Me",
            "amount": 3
          }
        ]
      }
    ],
    "tags": [
      "Leap"
    ]
  },
  {
    "name": "_ForcefulTest",
    "style": "Grappler",
    "priority": 3,
    "requirements": [],
    "effects": [],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Forceful",
        "amount": 2,
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 35
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "_PickOneTest",
    "style": "Grappler",
    "priority": 3,
    "requirements": [],
    "effects": [],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Pick One",
        "choices": [
          [
            {
              "axis": "Damage",
              "player": "Them",
              "amount": 44
            }
          ],
          [
            {
              "axis": "Poise",
              "player": "Me",
              "amount": 9
            }
          ]
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "_Tele",
    "style": "Grappler",
    "priority": 3,
    "requirements": [],
    "effects": [],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Both"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 20
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "1000 Cuts",
    "style": "Finesse",
    "priority": 1,
    "requirements": [
      {
        "axis": "Moving",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 4
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 4
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Accurate Strike",
    "style": "Finesse",
    "priority": 6,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 4
      },
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Parry",
        "amount": 5
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Predict",
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 8
          }
        ]
      }
    ],
    "tags": [
      "Weak Spot"
    ]
  },
  {
    "name": "Adrenaline Surge",
    "style": "Seeing Red",
    "priority": 3,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Balanced",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Me",
            "amount": 3
          },
          {
            "axis": "Reflex"
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Moving",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Poise",
            "player": "Me",
            "amount": 1
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Aim",
    "style": "Hunter",
    "priority": 4,
    "requirements": [
      {
        "axis": "Not Close",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Enhance",
        "enhancedTag": "Shot",
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 8
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Analyze Opponent",
    "style": "Mastermind",
    "priority": 4,
    "requirements": [
      {
        "axis": "Fresh",
        "player": "Both"
      },
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Both"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Block",
        "amount": 10
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Them"
          },
          {
            "axis": "Poise",
            "player": "Me"
          }
        ],
        "effects": []
      }
    ],
    "tags": []
  },
  {
    "name": "Ankle Smash",
    "style": "Immovable",
    "priority": 3,
    "requirements": [
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Them"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 12
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 3
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Forceful",
        "amount": 3,
        "effects": [
          {
            "axis": "Cripple",
            "detail": "Leg"
          }
        ]
      }
    ],
    "tags": [
      "Smash"
    ]
  },
  {
    "name": "Bite",
    "style": "Cheap Shot",
    "priority": 4,
    "requirements": [
      {
        "axis": "Grappled",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 5
      },
      {
        "axis": "Grappled",
        "player": "Both"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Standing",
            "player": "Me"
          },
          {
            "axis": "Prone",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 3
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Standing",
            "player": "Both"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 5
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Bloody Finale",
    "style": "Seeing Red",
    "priority": 4,
    "requirements": [
      {
        "axis": "Bloodied",
        "player": "Them"
      },
      {
        "axis": "Unbalanced",
        "player": "Them"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 10
      },
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Forceful",
        "amount": 8,
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 10
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Bloody Flourish",
    "style": "Crowd Pleaser",
    "priority": 4,
    "requirements": [
      {
        "axis": "Anticipating",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 3
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 3
      },
      {
        "axis": "Reflex"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Unbalanced",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 4
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Body Slam",
    "style": "Kobra Kai",
    "priority": 5,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 7
      },
      {
        "axis": "Close",
        "player": "Both",
        "amount": 2
      },
      {
        "axis": "Prone",
        "player": "Both",
        "amount": 3
      },
      {
        "axis": "Still",
        "player": "Both"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Moving",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 3
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Unbalanced",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Both",
            "amount": 5
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Bolas",
    "style": "Tools Of The Trade",
    "priority": 8,
    "requirements": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 6
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Still",
            "player": "Me"
          },
          {
            "axis": "Standing",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 4
          },
          {
            "axis": "Prone",
            "player": "Them",
            "amount": 2
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Boom, Headshot!",
    "style": "Hunter",
    "priority": 7,
    "requirements": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Anticipating",
        "player": "Me"
      },
      {
        "axis": "Not Anticipating",
        "player": "Them"
      },
      {
        "axis": "Still",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Lose Poise",
        "player": "Me",
        "amount": 1
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Predict",
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 38
          }
        ]
      }
    ],
    "tags": [
      "Shot"
    ]
  },
  {
    "name": "Break Their Form",
    "style": "Kobra Kai",
    "priority": 8,
    "requirements": [
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 3
      },
      {
        "axis": "Moving",
        "player": "Them",
        "amount": 3
      },
      {
        "axis": "Rigid",
        "player": "Them",
        "amount": 1
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Forceful",
        "amount": 2,
        "effects": [
          {
            "axis": "Rigid",
            "player": "Them",
            "amount": 1
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Calculated",
    "style": "Mastermind",
    "priority": 5,
    "requirements": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Not Anticipating",
        "player": "Them"
      },
      {
        "axis": "Moving",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Lose Poise",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Predict",
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 5
          },
          {
            "axis": "Prone",
            "player": "Them",
            "amount": 3
          },
          {
            "axis": "Parry",
            "amount": 15
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Calm",
    "style": "Seeing Red",
    "priority": 6,
    "requirements": [
      {
        "axis": "Fresh",
        "player": "Me"
      },
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 3
      },
      {
        "axis": "Poise",
        "player": "Them",
        "amount": 1
      },
      {
        "axis": "Still",
        "player": "Me"
      },
      {
        "axis": "Parry",
        "amount": 5
      },
      {
        "axis": "Flow",
        "player": "Me",
        "amount": 1
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Charge",
    "style": "All In",
    "priority": 7,
    "requirements": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Lose Poise",
        "player": "Me",
        "amount": 1
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Charging Flourish",
    "style": "Crowd Pleaser",
    "priority": 4,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 3
      },
      {
        "axis": "Closer",
        "player": "Both"
      },
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Me",
            "amount": 2
          },
          {
            "axis": "Reflex"
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Circle Opponent",
    "style": "Grappler",
    "priority": 5,
    "requirements": [
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Not Grappled",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Predict",
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 3
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Grappled",
            "player": "Both"
          },
          {
            "axis": "Balanced",
            "player": "Me"
          },
          {
            "axis": "Prone",
            "player": "Both"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 18
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Clever Reposition",
    "style": "Finesse",
    "priority": 4,
    "requirements": [
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Parry",
        "amount": 4
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Clever Ruse",
    "style": "Mastermind",
    "priority": 8,
    "requirements": [
      {
        "axis": "Grappled",
        "player": "Both"
      },
      {
        "axis": "Anticipating",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Parry",
        "amount": 4
      },
      {
        "axis": "Setup",
        "amount": 3
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Coup de Gras",
    "style": "Finesse",
    "priority": 4,
    "requirements": [
      {
        "axis": "Bloodied",
        "player": "Them"
      },
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Unbalanced",
        "player": "Them"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Prone",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 17
      },
      {
        "axis": "Lose Poise",
        "player": "Me",
        "amount": 4
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Cower",
    "style": "Jester",
    "priority": 6,
    "requirements": [
      {
        "axis": "Bloodied",
        "player": "Me"
      },
      {
        "axis": "Close",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Lose Poise",
        "player": "Both",
        "amount": 2
      },
      {
        "axis": "Prone",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Still",
        "player": "Me"
      },
      {
        "axis": "Block",
        "amount": 8
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Damage",
            "player": "Me"
          },
          {
            "axis": "Not Anticipating",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 1
          },
          {
            "axis": "Block",
            "amount": 3
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Crank",
    "style": "Tools Of The Trade",
    "priority": 5,
    "requirements": [
      {
        "axis": "Not Anticipating",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Me",
        "amount": 5
      },
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Moving",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Poise",
            "player": "Me",
            "amount": 1
          },
          {
            "axis": "Flow",
            "player": "Me",
            "amount": 1
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Crippled Chest",
    "style": "Grappler",
    "priority": 5,
    "requirements": [
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Me",
        "amount": 10
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Crippled Everything",
    "style": "Grappler",
    "priority": 5,
    "requirements": [],
    "effects": [
      {
        "axis": "Damage",
        "player": "Me",
        "amount": 100
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Crippled Leg",
    "style": "Grappler",
    "priority": 5,
    "requirements": [
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Me",
        "amount": 3
      },
      {
        "axis": "Prone",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Crippled Pysche",
    "style": "Grappler",
    "priority": 5,
    "requirements": [
      {
        "axis": "Unbalanced",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Me",
        "amount": 6
      },
      {
        "axis": "Prone",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Crush",
    "style": "Cheap Shot",
    "priority": 6,
    "requirements": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Anticipating",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Prone",
        "player": "Them"
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Grappled",
        "player": "Both"
      },
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 5
      },
      {
        "axis": "Setup",
        "amount": 4
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Dazzling Display",
    "style": "Net And Trident",
    "priority": 6,
    "requirements": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Anticipating",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 1
      },
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Parry",
        "amount": 3
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Enhance",
        "enhancedTag": "Perform",
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 1
          },
          {
            "axis": "Parry",
            "amount": 2
          }
        ]
      }
    ],
    "tags": [
      "Perform"
    ]
  },
  {
    "name": "Death From Above",
    "style": "Death From Above",
    "priority": 7,
    "requirements": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Prone",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 7
      },
      {
        "axis": "Grappled",
        "player": "Both"
      },
      {
        "axis": "Prone",
        "player": "Both",
        "amount": 3
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [],
    "tags": [
      "Leap"
    ]
  },
  {
    "name": "Defensive Crawl",
    "style": "Grappler",
    "priority": 9,
    "requirements": [
      {
        "axis": "Prone",
        "player": "Me"
      },
      {
        "axis": "Far",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Close",
        "player": "Both",
        "amount": 2
      },
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Block",
        "amount": 7
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Defensive Roll",
    "style": "All In",
    "priority": 5,
    "requirements": [
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Prone",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Further",
        "player": "Both"
      },
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Balanced",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Block",
            "amount": 7
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Desperate Swing",
    "style": "Crowd Pleaser",
    "priority": 4,
    "requirements": [
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 8
      },
      {
        "axis": "Lose Poise",
        "player": "Both",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Forceful",
        "amount": 2,
        "effects": []
      },
      {
        "index": 1,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Bloodied",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Me",
            "amount": 5
          },
          {
            "axis": "Reflex"
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Disengage",
    "style": "Unstoppable",
    "priority": 7,
    "requirements": [
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Further",
        "player": "Both"
      },
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 3
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Block",
            "amount": 5
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Drive Down",
    "style": "Seeing Red",
    "priority": 7,
    "requirements": [
      {
        "axis": "Close",
        "player": "Me"
      },
      {
        "axis": "Unbalanced",
        "player": "Them"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 8
      },
      {
        "axis": "Grappled",
        "player": "Both"
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 9
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Drop Caltrops",
    "style": "Tools Of The Trade",
    "priority": 3,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Balanced",
            "player": "Me"
          },
          {
            "axis": "Further",
            "player": "Both"
          }
        ],
        "effects": []
      },
      {
        "index": 1,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Moving",
            "player": "Them"
          },
          {
            "axis": "Damage",
            "player": "Them"
          }
        ],
        "effects": []
      }
    ],
    "tags": []
  },
  {
    "name": "Drop Chandelier",
    "style": "Mastermind",
    "priority": 3,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Anticipating",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 9
      },
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 1
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 3
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Prone",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 1
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Dust Off",
    "style": "Net And Trident",
    "priority": 6,
    "requirements": [
      {
        "axis": "Prone",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      },
      {
        "axis": "Block",
        "amount": 3
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Pick One",
        "choices": [
          [
            {
              "axis": "Further",
              "player": "Both"
            }
          ],
          [
            {
              "axis": "Block",
              "amount": 3
            }
          ]
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Eel Kick",
    "style": "Drunken Master",
    "priority": 5,
    "requirements": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Prone",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 7
      },
      {
        "axis": "Still",
        "player": "Them"
      },
      {
        "axis": "Cripple",
        "detail": "Chest"
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Elbow Drop",
    "style": "Death From Above",
    "priority": 7,
    "requirements": [
      {
        "axis": "Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 10
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Exactly As Planned",
    "style": "Mastermind",
    "priority": 6,
    "requirements": [
      {
        "axis": "Fresh",
        "player": "Them"
      },
      {
        "axis": "Bloodied",
        "player": "Me"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Prone",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 14
      },
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Prone",
        "player": "Them"
      },
      {
        "axis": "Parry",
        "player": "Them",
        "amount": 6
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Exploit Weakness",
    "style": "Finesse",
    "priority": 5,
    "requirements": [
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Block",
        "amount": 7
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Me"
          },
          {
            "axis": "Unbalanced",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 15
          },
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 2
          },
          {
            "axis": "Prone",
            "player": "Them",
            "amount": 3
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Face Smash",
    "style": "Death From Above",
    "priority": 4,
    "requirements": [
      {
        "axis": "Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Prone",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 8
      },
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 1
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Forceful",
        "amount": 4,
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 8
          },
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 1
          },
          {
            "axis": "Still",
            "player": "Them",
            "amount": 3
          }
        ]
      }
    ],
    "tags": [
      "Smash"
    ]
  },
  {
    "name": "Fancy Footwork",
    "style": "Finesse",
    "priority": 4,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 1
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 3
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Moving",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Parry",
            "amount": 3
          }
        ]
      }
    ],
    "tags": [
      "Blade"
    ]
  },
  {
    "name": "Feign Strength",
    "style": "Crowd Pleaser",
    "priority": 7,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Poise",
        "player": "Them",
        "amount": 3
      },
      {
        "axis": "Block",
        "amount": 4
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Predict",
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 3
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Feint",
    "style": "Crowd Pleaser",
    "priority": 6,
    "requirements": [
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 1
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Still",
        "player": "Them",
        "amount": 1
      },
      {
        "axis": "Block",
        "amount": 6
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Still",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Block",
            "amount": 5
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Femoral Strike",
    "style": "Finesse",
    "priority": 5,
    "requirements": [
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Anticipating",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 4
      },
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Standing",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 2
          },
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 1
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Find The Joint",
    "style": "Death From Above",
    "priority": 3,
    "requirements": [
      {
        "axis": "Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Prone",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 6
      },
      {
        "axis": "Grappled",
        "player": "Both"
      },
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 1
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Still",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 6
          },
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 1
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Finish Them",
    "style": "Kobra Kai",
    "priority": 5,
    "requirements": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Prone",
        "player": "Them"
      },
      {
        "axis": "Still",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 18
      },
      {
        "axis": "Rigid",
        "player": "Them",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Bloodied",
            "player": "Them"
          },
          {
            "axis": "Unbalanced",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 7
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Firecrackers",
    "style": "Tools Of The Trade",
    "priority": 7,
    "requirements": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Not Anticipating",
        "player": "Them"
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 3
      },
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Standing",
        "player": "Them"
      },
      {
        "axis": "Moving",
        "player": "Them",
        "amount": 3
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Flash Bang!",
    "style": "Tools Of The Trade",
    "priority": 7,
    "requirements": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Both"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Still",
        "player": "Them"
      },
      {
        "axis": "Setup",
        "amount": 4
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Flow Down",
    "style": "Drunken Master",
    "priority": 7,
    "requirements": [
      {
        "axis": "Moving",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Prone",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 4
      },
      {
        "axis": "Block",
        "amount": 7
      },
      {
        "axis": "Flow",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Parry",
            "amount": 4
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Flying Kick",
    "style": "Kobra Kai",
    "priority": 6,
    "requirements": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 6
      },
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 3
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Forceful",
        "amount": 2,
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 7
          }
        ]
      }
    ],
    "tags": [
      "Kick"
    ]
  },
  {
    "name": "Flying Slash",
    "style": "Crowd Pleaser",
    "priority": 5,
    "requirements": [
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 4
      },
      {
        "axis": "Closer",
        "player": "Both"
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Forceful",
        "amount": 2,
        "requirements": [
          {
            "axis": "Damage",
            "player": "Them"
          }
        ],
        "effects": []
      },
      {
        "index": 1,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Unbalanced",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 4
          },
          {
            "axis": "Prone",
            "player": "Them",
            "amount": 3
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Full Guard",
    "style": "All In",
    "priority": 7,
    "requirements": [
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Lose Poise",
        "player": "Me",
        "amount": 3
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      },
      {
        "axis": "Block",
        "amount": 15
      },
      {
        "axis": "Parry",
        "amount": 5
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Gloat",
    "style": "Net And Trident",
    "priority": 6,
    "requirements": [
      {
        "axis": "Fresh",
        "player": "Me"
      },
      {
        "axis": "Unbalanced",
        "player": "Them"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Further",
        "player": "Both"
      },
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Fresh",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Poise",
            "player": "Me",
            "amount": 1
          },
          {
            "axis": "Parry",
            "amount": 2
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Bloodied",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Me",
            "amount": 6
          }
        ]
      }
    ],
    "tags": [
      "Perform"
    ]
  },
  {
    "name": "Goad",
    "style": "Crowd Pleaser",
    "priority": 5,
    "requirements": [
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 3
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Damage",
            "player": "Me"
          },
          {
            "axis": "Balanced",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Reflex"
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Going For The High Ground",
    "style": "Cheap Shot",
    "priority": 4,
    "requirements": [
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Them"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Prone",
            "player": "Them"
          },
          {
            "axis": "Standing",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 12
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Forceful",
        "amount": 1,
        "effects": [
          {
            "axis": "Block",
            "amount": 3
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Going For The Pin",
    "style": "Grappler",
    "priority": 5,
    "requirements": [
      {
        "axis": "Prone",
        "player": "Both"
      },
      {
        "axis": "Not Far",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 5
      },
      {
        "axis": "Prone",
        "player": "Both",
        "amount": 2
      },
      {
        "axis": "Block",
        "amount": 5
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Grappled",
            "player": "Both"
          }
        ],
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 3
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Unbalanced",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Poise",
            "player": "Me",
            "amount": 3
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Got Your Back",
    "style": "Finesse",
    "priority": 6,
    "requirements": [
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 1
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 3
      },
      {
        "axis": "Block",
        "amount": 8
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Predict",
        "effects": [
          {
            "axis": "Reflex"
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Grab n Slam",
    "style": "All In",
    "priority": 8,
    "requirements": [
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 13
      },
      {
        "axis": "Damage",
        "player": "Me",
        "amount": 5
      },
      {
        "axis": "Grappled",
        "player": "Both"
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Grand Setup",
    "style": "Death From Above",
    "priority": 9,
    "requirements": [
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Further",
        "player": "Both"
      },
      {
        "axis": "Moving",
        "player": "Them",
        "amount": 3
      },
      {
        "axis": "Setup",
        "amount": 4
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Grappled",
            "player": "Both"
          },
          {
            "axis": "Prone",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Reflex"
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Forceful",
        "amount": 2,
        "effects": []
      }
    ],
    "tags": []
  },
  {
    "name": "Grenade",
    "style": "Tools Of The Trade",
    "priority": 8,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 8
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 1
      },
      {
        "axis": "Prone",
        "player": "Both",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Bloodied",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 4
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Close",
            "player": "Both"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Me",
            "amount": 4
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Groin Stomp",
    "style": "Cheap Shot",
    "priority": 6,
    "requirements": [
      {
        "axis": "Prone",
        "player": "Them"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Not Far",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 7
      },
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 1
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 3
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Forceful",
        "amount": 3,
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 7
          },
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 2
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Guarded Maneuvers",
    "style": "Unstoppable",
    "priority": 3,
    "requirements": [
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Block",
        "amount": 7
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Pick One",
        "choices": [
          [
            {
              "axis": "Closer",
              "player": "Both"
            }
          ],
          [
            {
              "axis": "Further",
              "player": "Both"
            }
          ]
        ]
      },
      {
        "index": 1,
        "mechanic": "Forceful",
        "amount": 2,
        "effects": [
          {
            "axis": "Block",
            "amount": 5
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Gut 'Em!",
    "style": "Hunter",
    "priority": 5,
    "requirements": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Anticipating",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Prone",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 13
      },
      {
        "axis": "Grappled",
        "player": "Both"
      },
      {
        "axis": "Prone",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Predict",
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 38
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Gut Shot",
    "style": "All In",
    "priority": 2,
    "requirements": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 12
      },
      {
        "axis": "Lose Poise",
        "player": "Both",
        "amount": 1
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 1
      }
    ],
    "mechanics": [],
    "tags": [
      "Weak Spot"
    ]
  },
  {
    "name": "Hardcore Parkour",
    "style": "Jester",
    "priority": 4,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Not Grappled",
            "player": "Both"
          },
          {
            "axis": "Moving",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Poise",
            "player": "Me",
            "amount": 1
          },
          {
            "axis": "Parry",
            "player": "Me",
            "amount": 3
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Haymaker",
    "style": "All In",
    "priority": 3,
    "requirements": [
      {
        "axis": "Anticipating",
        "player": "Me"
      },
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 20
      },
      {
        "axis": "Lose Poise",
        "player": "Me",
        "amount": 4
      },
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Prone",
        "player": "Them"
      }
    ],
    "mechanics": [],
    "tags": [
      "Punch"
    ]
  },
  {
    "name": "Headbutt",
    "style": "Unstoppable",
    "priority": 4,
    "requirements": [
      {
        "axis": "Grappled",
        "player": "Both"
      },
      {
        "axis": "Moving",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 5
      },
      {
        "axis": "Still",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Them",
        "amount": 3
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Close",
            "player": "Both"
          },
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 7
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Hogtie",
    "style": "Hunter",
    "priority": 5,
    "requirements": [
      {
        "axis": "Bloodied",
        "player": "Them"
      },
      {
        "axis": "Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Prone",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Grappled",
        "player": "Both"
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 4
      },
      {
        "axis": "Block",
        "amount": 5
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Prone",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 2
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Forceful",
        "amount": 2,
        "effects": [
          {
            "axis": "Clutch",
            "amount": 4
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Holographic Copies",
    "style": "Mastermind",
    "priority": 2,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Block",
        "amount": 4
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 2
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Not Grappled",
            "player": "Both"
          },
          {
            "axis": "Balanced",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Block",
            "amount": 3
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Howling Charge",
    "style": "Seeing Red",
    "priority": 7,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Block",
        "amount": 7
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Forceful",
        "amount": 3,
        "effects": [
          {
            "axis": "Cripple",
            "detail": "Psyche"
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Hurl",
    "style": "Unstoppable",
    "priority": 6,
    "requirements": [
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 6
      },
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 1
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 3
      },
      {
        "axis": "Moving",
        "player": "Both",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 4
          },
          {
            "axis": "Far",
            "player": "Both"
          },
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 1
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Immovable Wall",
    "style": "Immovable",
    "priority": 8,
    "requirements": [
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 8
      },
      {
        "axis": "Lose Poise",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Still",
        "player": "Both"
      },
      {
        "axis": "Block",
        "amount": 8
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Impale",
    "style": "Net And Trident",
    "priority": 6,
    "requirements": [
      {
        "axis": "Unbalanced",
        "player": "Them"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Prone",
        "player": "Them"
      },
      {
        "axis": "Moving",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 15
      },
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Incoming!",
    "style": "Unstoppable",
    "priority": 3,
    "requirements": [
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 4
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Moving",
            "player": "Me"
          },
          {
            "axis": "Still",
            "player": "Them"
          },
          {
            "axis": "Not Far",
            "player": "Both"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 10
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Inertia",
    "style": "Immovable",
    "priority": 3,
    "requirements": [
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Balanced",
            "player": "Me"
          },
          {
            "axis": "Still",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Block",
            "amount": 4
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Balanced",
            "player": "Me"
          },
          {
            "axis": "Moving",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 4
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Insidious Plan",
    "style": "Mastermind",
    "priority": 2,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Anticipating",
        "player": "Me"
      }
    ],
    "effects": [],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Grappled",
            "player": "Both"
          },
          {
            "axis": "Balanced",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Me",
            "amount": 5
          },
          {
            "axis": "Lose Poise",
            "player": "Me",
            "amount": 2
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Me"
          },
          {
            "axis": "Unbalanced",
            "player": "Them"
          },
          {
            "axis": "Prone",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 30
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Joint Lock",
    "style": "Grappler",
    "priority": 8,
    "requirements": [
      {
        "axis": "Close",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 6
      },
      {
        "axis": "Grappled",
        "player": "Both"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 2
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Kick Away",
    "style": "Death From Above",
    "priority": 8,
    "requirements": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Prone",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 5
      },
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Knife Throw",
    "style": "Tools Of The Trade",
    "priority": 3,
    "requirements": [
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 5
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Forceful",
        "amount": 3,
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 6
          }
        ]
      }
    ],
    "tags": [
      "Blade"
    ]
  },
  {
    "name": "Leaping Clothesline",
    "style": "Death From Above",
    "priority": 8,
    "requirements": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 9
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 3
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Forceful",
        "amount": 3,
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 3
          },
          {
            "axis": "Clutch",
            "amount": 4
          },
          {
            "axis": "Rigid",
            "player": "Them",
            "amount": 1
          }
        ]
      }
    ],
    "tags": [
      "Leap"
    ]
  },
  {
    "name": "Leaping Smash",
    "style": "Unstoppable",
    "priority": 8,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Prone",
        "player": "Them"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 11
      },
      {
        "axis": "Lose Poise",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Far",
            "player": "Both"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 4
          },
          {
            "axis": "Close",
            "player": "Both"
          },
          {
            "axis": "Lose Poise",
            "player": "Me",
            "amount": 1
          }
        ]
      }
    ],
    "tags": [
      "Leap",
      "Smash"
    ]
  },
  {
    "name": "Leg Grab",
    "style": "Grappler",
    "priority": 7,
    "requirements": [
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Close",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Grappled",
        "player": "Both"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Predict",
        "effects": [
          {
            "axis": "Prone",
            "player": "Them",
            "amount": 4
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Low Blow",
    "style": "All In",
    "priority": 5,
    "requirements": [
      {
        "axis": "Grappled",
        "player": "Both"
      },
      {
        "axis": "Not Anticipating",
        "player": "Them"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 5
      },
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 1
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 2
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Low Stance",
    "style": "Immovable",
    "priority": 6,
    "requirements": [
      {
        "axis": "Prone",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Pick One",
        "choices": [
          [
            {
              "axis": "Poise",
              "player": "Me",
              "amount": 2
            },
            {
              "axis": "Block",
              "amount": 3
            }
          ],
          [
            {
              "axis": "Block",
              "amount": 10
            }
          ]
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Luring Trap",
    "style": "Mastermind",
    "priority": 3,
    "requirements": [
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Further",
        "player": "Both"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Unbalanced",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 7
          },
          {
            "axis": "Prone",
            "player": "Them",
            "amount": 3
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Makeshift Weapon",
    "style": "Cheap Shot",
    "priority": 4,
    "requirements": [
      {
        "axis": "Bloodied",
        "player": "Both"
      },
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Parry",
        "amount": 3
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Not Grappled",
            "player": "Both"
          },
          {
            "axis": "Balanced",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 3
          },
          {
            "axis": "Parry",
            "amount": 3
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Maniacal Laughter",
    "style": "Jester",
    "priority": 7,
    "requirements": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 4
      },
      {
        "axis": "Prone",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Forceful",
        "amount": 3,
        "effects": [
          {
            "axis": "Cripple",
            "detail": "Pysche"
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Meet Charge",
    "style": "Story",
    "priority": 4,
    "requirements": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Moving",
        "player": "Them"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 7
      },
      {
        "axis": "Parry",
        "amount": 4
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Forceful",
        "amount": 2,
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 4
          },
          {
            "axis": "Prone",
            "player": "Them",
            "amount": 2
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Mounting Force",
    "style": "Unstoppable",
    "priority": 3,
    "requirements": [
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Me"
          },
          {
            "axis": "Moving",
            "player": "Me"
          },
          {
            "axis": "Still",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 15
          },
          {
            "axis": "Block",
            "amount": 10
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Nailed!",
    "style": "Mastermind",
    "priority": 7,
    "requirements": [
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 5
      },
      {
        "axis": "Still",
        "player": "Them"
      },
      {
        "axis": "Rigid",
        "player": "Them",
        "amount": 2
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Neck Break",
    "style": "Grappler",
    "priority": 2,
    "requirements": [
      {
        "axis": "Prone",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Grappled",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 13
      },
      {
        "axis": "Grappled",
        "player": "Both"
      },
      {
        "axis": "Prone",
        "player": "Both",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 7
          },
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 3
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Forceful",
        "amount": 6,
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 13
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Opportunist",
    "style": "Kobra Kai",
    "priority": 4,
    "requirements": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Unbalanced",
        "player": "Them"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Predict",
        "effects": [
          {
            "axis": "Reflex"
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Overrun",
    "style": "Unstoppable",
    "priority": 6,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 8
      },
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 4
      },
      {
        "axis": "Still",
        "player": "Them"
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Parry, Riposte",
    "style": "Finesse",
    "priority": 6,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Parry",
        "amount": 6
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Predict",
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 12
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Me"
          },
          {
            "axis": "Moving",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Parry",
            "amount": 3
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Piercing Lunge",
    "style": "Seeing Red",
    "priority": 4,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 8
      },
      {
        "axis": "Lose Poise",
        "player": "Me",
        "amount": 3
      },
      {
        "axis": "Closer",
        "player": "Both"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Predict",
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 8
          },
          {
            "axis": "Still",
            "player": "Them"
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Pile Driver",
    "style": "Grappler",
    "priority": 3,
    "requirements": [
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Grappled",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 3
      },
      {
        "axis": "Grappled",
        "player": "Both"
      },
      {
        "axis": "Prone",
        "player": "Both",
        "amount": 3
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Pick One",
        "choices": [
          [
            {
              "axis": "Lose Poise",
              "player": "Me",
              "amount": 2
            },
            {
              "axis": "Reflex"
            }
          ],
          [
            {
              "axis": "Damage",
              "player": "Them",
              "amount": 5
            },
            {
              "axis": "Lose Poise",
              "player": "Them",
              "amount": 3
            }
          ]
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Pinning Shot",
    "style": "Hunter",
    "priority": 4,
    "requirements": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 3
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 1
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Forceful",
        "amount": 2,
        "effects": [
          {
            "axis": "Prone",
            "player": "Them",
            "amount": 3
          },
          {
            "axis": "Clutch",
            "amount": 2
          }
        ]
      }
    ],
    "tags": [
      "Shot"
    ]
  },
  {
    "name": "Poison Dart",
    "style": "Tools Of The Trade",
    "priority": 3,
    "requirements": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Not Anticipating",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Predict",
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 3
          },
          {
            "axis": "Rigid",
            "player": "Them",
            "amount": 3
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Pull By The Neck",
    "style": "Net And Trident",
    "priority": 5,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Closer",
        "player": "Both"
      },
      {
        "axis": "Moving",
        "player": "Them",
        "amount": 3
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Moving",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 7
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Unbalanced",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 10
          },
          {
            "axis": "Prone",
            "player": "Them"
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Pull Of Wine",
    "style": "Drunken Master",
    "priority": 5,
    "requirements": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Not Anticipating",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Lose Poise",
        "player": "Me",
        "amount": 3
      },
      {
        "axis": "Parry",
        "amount": 4
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Not Grappled",
            "player": "Both"
          },
          {
            "axis": "Standing",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Poise",
            "player": "Me",
            "amount": 1
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Enhance",
        "enhancedTag": "Kick",
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 3
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Punchline",
    "style": "Jester",
    "priority": 5,
    "requirements": [
      {
        "axis": "Anticipating",
        "player": "Me"
      },
      {
        "axis": "Not Anticipating",
        "player": "Them"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 18
      },
      {
        "axis": "Lose Poise",
        "player": "Both",
        "amount": 3
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 4
      },
      {
        "axis": "Cripple",
        "detail": "Pysche"
      }
    ],
    "mechanics": [],
    "tags": [
      "Punch"
    ]
  },
  {
    "name": "Pysch Up!",
    "style": "All In",
    "priority": 5,
    "requirements": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 3
      },
      {
        "axis": "Still",
        "player": "Me"
      },
      {
        "axis": "Flow",
        "player": "Me",
        "amount": 1
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Ready To Strike",
    "style": "Kobra Kai",
    "priority": 3,
    "requirements": [
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      },
      {
        "axis": "Parry",
        "amount": 3
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Ready Trident",
    "style": "Net And Trident",
    "priority": 4,
    "requirements": [
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Prone",
            "player": "Them"
          },
          {
            "axis": "Moving",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 10
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Ready, Steady",
    "style": "Death From Above",
    "priority": 5,
    "requirements": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Pick One",
        "choices": [
          [
            {
              "axis": "Poise",
              "player": "Me",
              "amount": 2
            }
          ],
          [
            {
              "axis": "Block",
              "amount": 8
            }
          ]
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Red Fury",
    "style": "Seeing Red",
    "priority": 4,
    "requirements": [
      {
        "axis": "Bloodied",
        "player": "Me"
      },
      {
        "axis": "Not Far",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 6
      },
      {
        "axis": "Lose Poise",
        "player": "Both",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Bloodied",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 4
          },
          {
            "axis": "Lose Poise",
            "player": "Me",
            "amount": 2
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Focus",
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 1
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Reflexive Retreat",
    "style": "Crowd Pleaser",
    "priority": 8,
    "requirements": [
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Prone",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Further",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Parry",
        "amount": 5
      },
      {
        "axis": "Rigid",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Setup",
        "amount": 3
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Rip From Socket",
    "style": "Cheap Shot",
    "priority": 5,
    "requirements": [
      {
        "axis": "Prone",
        "player": "Me"
      },
      {
        "axis": "Not Far",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 7
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Forceful",
        "amount": 1,
        "effects": [
          {
            "axis": "Prone",
            "player": "Them",
            "amount": 3
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Root",
    "style": "Immovable",
    "priority": 10,
    "requirements": [
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Lose Poise",
        "player": "Me",
        "amount": 3
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      },
      {
        "axis": "Block",
        "amount": 10
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Seething Red",
    "style": "Seeing Red",
    "priority": 5,
    "requirements": [
      {
        "axis": "Bloodied",
        "player": "Me"
      },
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 5
      },
      {
        "axis": "Lose Poise",
        "player": "Me",
        "amount": 1
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Damage",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 5
          },
          {
            "axis": "Lose Poise",
            "player": "Me",
            "amount": 2
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Set Snare",
    "style": "Hunter",
    "priority": 6,
    "requirements": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Prone",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Far",
            "player": "Both"
          },
          {
            "axis": "Not Anticipating",
            "player": "Them"
          },
          {
            "axis": "Moving",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 4
          },
          {
            "axis": "Prone",
            "player": "Them",
            "amount": 2
          },
          {
            "axis": "Still",
            "player": "Them"
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Set-Up",
    "style": "Jester",
    "priority": 3,
    "requirements": [
      {
        "axis": "Bloodied",
        "player": "Me"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Still",
        "player": "Both"
      },
      {
        "axis": "Block",
        "amount": 6
      },
      {
        "axis": "Setup",
        "amount": 4
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Predict",
        "effects": [
          {
            "axis": "Poise",
            "player": "Me",
            "amount": 3
          },
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 2
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Skewer",
    "style": "Net And Trident",
    "priority": 3,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Prone",
        "player": "Them"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 5
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 3
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Moving",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 6
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Sky Shot",
    "style": "Hunter",
    "priority": 4,
    "requirements": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 1
      },
      {
        "axis": "Flow",
        "player": "Me",
        "amount": 1
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Not Grappled",
            "player": "Both"
          },
          {
            "axis": "Not Anticipating",
            "player": "Them"
          },
          {
            "axis": "Prone",
            "player": "Them"
          },
          {
            "axis": "Still",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 15
          },
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 2
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Smash Kneecap",
    "style": "Kobra Kai",
    "priority": 4,
    "requirements": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Them"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 5
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Prone",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 3
          },
          {
            "axis": "Lose Poise",
            "player": "Me",
            "amount": 1
          },
          {
            "axis": "Clutch",
            "amount": 3
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 3
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Smoke Bomb",
    "style": "Tools Of The Trade",
    "priority": 3,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Block",
        "amount": 8
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Prone",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Poise",
            "player": "Me",
            "amount": 1
          },
          {
            "axis": "Block",
            "amount": 3
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Spinning Slash",
    "style": "Crowd Pleaser",
    "priority": 4,
    "requirements": [
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Grappled",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 6
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 4
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Predict",
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 2
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 8
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Spring Trap",
    "style": "Cheap Shot",
    "priority": 6,
    "requirements": [
      {
        "axis": "Prone",
        "player": "Me"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 5
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Predict",
        "requirements": [
          {
            "axis": "Damage",
            "player": "Them"
          }
        ],
        "effects": []
      }
    ],
    "tags": []
  },
  {
    "name": "Squirm",
    "style": "Jester",
    "priority": 9,
    "requirements": [
      {
        "axis": "Grappled",
        "player": "Both"
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Lose Poise",
        "player": "Both",
        "amount": 2
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Staggering Steps",
    "style": "Drunken Master",
    "priority": 5,
    "requirements": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Both"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Lose Poise",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Parry",
        "amount": 4
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Not Far",
            "player": "Both"
          },
          {
            "axis": "Unbalanced",
            "player": "Them"
          },
          {
            "axis": "Prone",
            "player": "Me"
          },
          {
            "axis": "Standing",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 10
          },
          {
            "axis": "Reflex"
          },
          {
            "axis": "Prone",
            "player": "Them",
            "amount": 3
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Stalk",
    "style": "Hunter",
    "priority": 7,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Not Anticipating",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Prone",
        "player": "Me",
        "amount": 2
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Bloodied",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Rigid",
            "player": "Them",
            "amount": 1
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Stone Strength",
    "style": "Immovable",
    "priority": 7,
    "requirements": [
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 3
      },
      {
        "axis": "Still",
        "player": "Me"
      },
      {
        "axis": "Block",
        "amount": 8
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Study Balance",
    "style": "Grappler",
    "priority": 2,
    "requirements": [
      {
        "axis": "Still",
        "player": "Me"
      },
      {
        "axis": "Fresh",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Predict",
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 3
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Prone",
            "player": "Both"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 7
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Stumble Away",
    "style": "Drunken Master",
    "priority": 8,
    "requirements": [
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Further",
        "player": "Both"
      },
      {
        "axis": "Parry",
        "amount": 4
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Surefooted Smash",
    "style": "Kobra Kai",
    "priority": 3,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 6
      },
      {
        "axis": "Closer",
        "player": "Both",
        "amount": 2
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Predict",
        "effects": [
          {
            "axis": "Poise",
            "player": "Me",
            "amount": 2
          },
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 2
          }
        ]
      }
    ],
    "tags": [
      "Smash"
    ]
  },
  {
    "name": "Swig Whiskey",
    "style": "Drunken Master",
    "priority": 3,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Not Anticipating",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Lose Poise",
        "player": "Me",
        "amount": 4
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Moving",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Poise",
            "player": "Me",
            "amount": 2
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Prone",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Parry",
            "player": "Me",
            "amount": 3
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Taking Control",
    "style": "Kobra Kai",
    "priority": 5,
    "requirements": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Lose Poise",
        "player": "Me",
        "amount": 1
      },
      {
        "axis": "Block",
        "amount": 7
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Prone",
            "player": "Them"
          },
          {
            "axis": "Still",
            "player": "Me"
          },
          {
            "axis": "Moving",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 5
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Targeted Strike",
    "style": "Finesse",
    "priority": 6,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 1
      },
      {
        "axis": "Parry",
        "amount": 2
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Close",
            "player": "Both"
          }
        ],
        "effects": [
          {
            "axis": "Close",
            "player": "Both"
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Pick One",
        "choices": [
          [
            {
              "axis": "Damage",
              "player": "Them",
              "amount": 7
            }
          ],
          [
            {
              "axis": "Lose Poise",
              "player": "Them",
              "amount": 3
            },
            {
              "axis": "Prone",
              "player": "Them",
              "amount": 2
            }
          ]
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Tazer",
    "style": "Tools Of The Trade",
    "priority": 5,
    "requirements": [
      {
        "axis": "Grappled",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Rigid",
        "player": "Them",
        "amount": 1
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Focus",
        "requirements": [
          {
            "axis": "Grappled",
            "player": "Both"
          },
          {
            "axis": "Still",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Rigid",
            "player": "Them",
            "amount": 1
          },
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 1
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Telegraphed Punch",
    "style": "All In",
    "priority": 5,
    "requirements": [
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Them"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Lose Poise",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Close",
            "player": "Both"
          },
          {
            "axis": "Not Anticipating",
            "player": "Them"
          },
          {
            "axis": "Still",
            "player": "Both"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 20
          },
          {
            "axis": "Rigid",
            "player": "Them",
            "amount": 2
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Tendon Slash",
    "style": "Crowd Pleaser",
    "priority": 4,
    "requirements": [
      {
        "axis": "Still",
        "player": "Them"
      },
      {
        "axis": "Prone",
        "player": "Me"
      },
      {
        "axis": "Not Far",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 4
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Unbalanced",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Cripple",
            "detail": "Leg"
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "The Boot",
    "style": "Death From Above",
    "priority": 9,
    "requirements": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 4
      },
      {
        "axis": "Far",
        "player": "Both"
      },
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 3
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Prone",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Me",
            "amount": 1
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Thrill Seeker",
    "style": "Death From Above",
    "priority": 4,
    "requirements": [
      {
        "axis": "Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Close",
        "player": "Both"
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Enhance",
        "enhancedTag": "Leap",
        "effects": [
          {
            "axis": "Poise",
            "player": "Me",
            "amount": 1
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Far",
            "player": "Both"
          },
          {
            "axis": "Standing",
            "player": "Me"
          },
          {
            "axis": "Prone",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Poise",
            "player": "Me",
            "amount": 2
          },
          {
            "axis": "Reflex"
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Throat Jab",
    "style": "Cheap Shot",
    "priority": 7,
    "requirements": [
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 6
      },
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 6
          },
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 1
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Throw Net",
    "style": "Net And Trident",
    "priority": 7,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 3
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 3
      },
      {
        "axis": "Moving",
        "player": "Them",
        "amount": 4
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Throw Rock",
    "style": "Cheap Shot",
    "priority": 4,
    "requirements": [
      {
        "axis": "Prone",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 4
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 5
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Predict",
        "requirements": [
          {
            "axis": "Lose Poise",
            "player": "Them"
          }
        ],
        "effects": []
      }
    ],
    "tags": []
  },
  {
    "name": "Tie The Noose",
    "style": "Net And Trident",
    "priority": 5,
    "requirements": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "effects": [],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Unbalanced",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 7
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Telegraph",
        "requirements": [
          {
            "axis": "Far",
            "player": "Both"
          },
          {
            "axis": "Moving",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 9
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "To The Ground",
    "style": "Grappler",
    "priority": 7,
    "requirements": [
      {
        "axis": "Prone",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Them"
      },
      {
        "axis": "Not Far",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 8
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 3
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Anticipating",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Reflex"
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Toss End Over End",
    "style": "Immovable",
    "priority": 10,
    "requirements": [
      {
        "axis": "Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Still",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 5
      },
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Moving",
        "player": "Them",
        "amount": 4
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Forceful",
        "amount": 3,
        "effects": [
          {
            "axis": "Far",
            "player": "Both"
          },
          {
            "axis": "Cripple",
            "detail": "Leg"
          }
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Trip",
    "style": "Hunter",
    "priority": 5,
    "requirements": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Both"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 8
      },
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 1
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 2
      },
      {
        "axis": "Still",
        "player": "Them"
      }
    ],
    "mechanics": [],
    "tags": []
  },
  {
    "name": "Tumble",
    "style": "Jester",
    "priority": 4,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Balanced",
        "player": "Me"
      },
      {
        "axis": "Moving",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Poise",
        "player": "Me",
        "amount": 3
      },
      {
        "axis": "Standing",
        "player": "Me"
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 4
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Pick One",
        "choices": [
          [
            {
              "axis": "Closer",
              "player": "Both"
            }
          ],
          [
            {
              "axis": "Further",
              "player": "Both"
            }
          ]
        ]
      }
    ],
    "tags": []
  },
  {
    "name": "Vicious Mockery",
    "style": "Jester",
    "priority": 5,
    "requirements": [
      {
        "axis": "Not Grappled",
        "player": "Both"
      },
      {
        "axis": "Anticipating",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Lose Poise",
        "player": "Them",
        "amount": 3
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Predict",
        "effects": [
          {
            "axis": "Parry",
            "amount": 5
          },
          {
            "axis": "Cripple",
            "detail": "Psyche"
          }
        ]
      }
    ],
    "tags": [
      "Perform"
    ]
  },
  {
    "name": "Whip Kick",
    "style": "Drunken Master",
    "priority": 6,
    "requirements": [
      {
        "axis": "Close",
        "player": "Both"
      },
      {
        "axis": "Prone",
        "player": "Me"
      },
      {
        "axis": "Standing",
        "player": "Them"
      }
    ],
    "effects": [
      {
        "axis": "Damage",
        "player": "Them",
        "amount": 9
      },
      {
        "axis": "Prone",
        "player": "Them",
        "amount": 3
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 3
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Unbalanced",
            "player": "Them"
          }
        ],
        "effects": [
          {
            "axis": "Damage",
            "player": "Them",
            "amount": 7
          }
        ]
      },
      {
        "index": 1,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Moving",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Lose Poise",
            "player": "Them",
            "amount": 2
          }
        ]
      }
    ],
    "tags": [
      "Kick"
    ]
  },
  {
    "name": "Worm Away",
    "style": "Jester",
    "priority": 7,
    "requirements": [
      {
        "axis": "Not Far",
        "player": "Both"
      },
      {
        "axis": "Prone",
        "player": "Me"
      }
    ],
    "effects": [
      {
        "axis": "Further",
        "player": "Both"
      },
      {
        "axis": "Moving",
        "player": "Me",
        "amount": 2
      }
    ],
    "mechanics": [
      {
        "index": 0,
        "mechanic": "Critical",
        "requirements": [
          {
            "axis": "Moving",
            "player": "Me"
          }
        ],
        "effects": [
          {
            "axis": "Parry",
            "amount": 5
          }
        ]
      }
    ],
    "tags": []
  }
];
