
import { EmergencyGuide, DrillTask } from './types';

export const EMERGENCY_GUIDES: EmergencyGuide[] = [
  {
    id: 'cpr',
    title: '心肺复苏 (CPR)',
    category: 'medical',
    summary: '当患者无呼吸、无意识时立即执行。',
    iconName: 'HeartPulse',
    quickSteps: ['呼叫120', '胸外按压30次', '人工呼吸2次', '循环直到急救到达'],
    steps: [
      {
        title: '判断意识与呼吸',
        description: '拍打双肩，大声呼唤。观察胸部起伏5-10秒。若无反应且无呼吸（或仅有濒死喘息），立即开始CPR。',
        durationSeconds: 10,
        isCritical: true
      },
      {
        title: '呼叫救援',
        description: '指定周围人拨打120，并寻找附近的AED（自动体外除颤器）。',
      },
      {
        title: '胸外按压',
        description: '双手交叠，掌根置于两乳头连线中点（胸骨下半部）。垂直向下按压，深度5-6cm，频率100-120次/分，回弹充分。',
        bpm: 110
      },
      {
        title: '人工呼吸',
        description: '仰头举颏开放气道。捏住鼻翼，口对口吹气2次，每次吹气1秒以上，见胸廓隆起。'
      }
    ]
  },
  {
    id: 'choking',
    title: '气道梗阻 (海姆立克)',
    category: 'medical',
    summary: '用于意识清醒但无法呼吸/咳嗽的异物卡喉者。',
    iconName: 'Activity',
    quickSteps: ['剪刀石头布手势', '环抱腹部', '向内向上冲击', '直到异物排出'],
    steps: [
      {
        title: '识别征兆',
        description: '患者双手“V”字形抓住颈部，面色发紫，无法说话或咳嗽。',
      },
      {
        title: '站位姿势',
        description: '站在患者身后，双脚弓步以稳住重心。',
      },
      {
        title: '腹部冲击',
        description: '一手握拳，拳眼对准肚脐上两指处。另一手包住拳头，用力快速向后上方冲击。',
        isCritical: true
      }
    ]
  },
  {
    id: 'bleeding',
    title: '严重出血',
    category: 'medical',
    summary: '直接压迫止血是首选方法。',
    iconName: 'Droplet',
    quickSteps: ['寻找出血点', '直接压迫', '填塞伤口', '止血带(若必要)'],
    steps: [
      {
        title: '暴露伤口',
        description: '剪开衣物，确切找到出血位置。',
      },
      {
        title: '直接压迫',
        description: '用干净纱布或衣物直接按压在伤口上，持续用力，不要松手检查。',
        durationSeconds: 180,
        isCritical: true
      },
      {
        title: '加压包扎',
        description: '保持压迫物不动，用绷带紧紧缠绕固定。抬高患肢。',
      }
    ]
  },
  {
    id: 'stroke',
    title: '脑卒中 (中风)',
    category: 'medical',
    summary: 'FAST原则：面部歪斜、肢体无力、言语不清。',
    iconName: 'Brain',
    quickSteps: ['Face:脸部不对称', 'Arm:手臂平举无力', 'Speech:言语不清', 'Time:立即送医'],
    steps: [
      {
        title: '快速识别 (FAST)',
        description: '检查微笑是否嘴歪；双手平举是否单侧无力；重复语句是否含糊。',
        isCritical: true
      },
      {
        title: '保持静卧',
        description: '让患者仰卧，头部稍高。若有呕吐，头偏向一侧防止窒息。切勿喂水喂药。',
      },
      {
        title: '记录时间',
        description: '记下发病确切时间，这对溶栓治疗至关重要。',
      }
    ]
  },
  {
    id: 'burns',
    title: '烧烫伤',
    category: 'medical',
    summary: '冲、脱、泡、盖、送。',
    iconName: 'ThermometerSun',
    quickSteps: ['流动冷水冲洗', '小心脱去衣物', '冷水浸泡', '干净纱布覆盖'],
    steps: [
      {
        title: '冷水冲洗',
        description: '立即用流动的凉水冲洗伤口15-30分钟，直到疼痛缓解。不要用冰块直接冰敷。',
        durationSeconds: 900,
        isCritical: true
      },
      {
        title: '保护创面',
        description: '小心除去伤口周围衣物（若粘连切勿强撕）。用无菌纱布或干净棉布轻轻覆盖。',
      },
      {
        title: '禁忌事项',
        description: '不要涂抹牙膏、酱油或草药。不要刺破水泡。',
      }
    ]
  },
  {
    id: 'fracture',
    title: '骨折',
    category: 'medical',
    summary: '制动固定，切勿随意复位。',
    iconName: 'Bone',
    quickSteps: ['检查伤情', '限制活动', '简易固定', '冷敷止痛'],
    steps: [
      {
        title: '限制活动',
        description: '不要移动受伤部位。如果必须移动，先进行固定。',
        isCritical: true
      },
      {
        title: '临时固定',
        description: '利用夹板、树枝、卷起的杂志等，将骨折处的上下两个关节固定住。',
      },
      {
        title: '开放性骨折处理',
        description: '若骨头外露，不要试图按回。先止血，覆盖无菌敷料，再进行固定。',
      }
    ]
  },
  {
    id: 'drowning',
    title: '溺水急救',
    category: 'medical',
    summary: '清理气道，先人工呼吸，再CPR。',
    iconName: 'Waves',
    quickSteps: ['开放气道', '人工呼吸5次', '按压30次', '持续循环'],
    steps: [
      {
        title: '清理气道',
        description: '救上岸后，迅速清理口鼻异物。不要“控水”（倒背奔跑等），这会延误抢救。',
        isCritical: true
      },
      {
        title: '人工呼吸优先',
        description: '溺水者核心缺氧，先进行5次人工呼吸，再进行30:2的CPR循环。',
      },
      {
        title: '保温保暖',
        description: '脱去湿衣物，用毛毯包裹，防止体温过低。',
      }
    ]
  },
  {
    id: 'fire',
    title: '火灾逃生',
    category: 'disaster',
    summary: '低姿弯腰，捂住口鼻，不贪财物。',
    iconName: 'Flame',
    quickSteps: ['湿毛巾捂口鼻', '低姿爬行', '摸门把手温度', '不乘电梯'],
    steps: [
      {
        title: '判断火情',
        description: '若门把手发烫，切勿开门，用湿布封堵门缝，在窗口求救。',
        isCritical: true
      },
      {
        title: '低姿撤离',
        description: '烟气上升，贴近地面空气相对较好。弯腰或爬行前进。'
      }
    ]
  },
  {
    id: 'snake',
    title: '毒蛇/虫咬伤',
    category: 'survival',
    summary: '保持冷静，认清蛇样，减少活动。',
    iconName: 'Snail',
    quickSteps: ['远离现场', '拍照/记特征', '放低患肢', '清水冲洗'],
    steps: [
      {
        title: '制动减缓扩散',
        description: '保持冷静，不要奔跑。去除患肢的手镯、戒指等束缚物。',
        isCritical: true
      },
      {
        title: '伤口处理',
        description: '用清水或肥皂水冲洗。不要切开伤口，不要用嘴吸毒。',
      },
      {
        title: '包扎',
        description: '在伤口近心端进行宽压带包扎（不宜过紧，能伸入一指为宜），减缓淋巴回流。',
      }
    ]
  }
];

export const DEFAULT_DRILLS: DrillTask[] = [
  { 
    id: '1', 
    title: '全家火灾逃生演练', 
    lastPerformed: null, 
    frequencyDays: 180,
    steps: [
      '所有家庭成员听到警报后立即停止手头工作',
      '用湿毛巾捂住口鼻，低姿势（爬行）前进',
      '检查房门把手温度，确认安全后开门',
      '按预定路线撤离到室外集合点',
      '清点人数，确认全员到达'
    ]
  },
  { 
    id: '2', 
    title: '急救包物资清点', 
    lastPerformed: null, 
    frequencyDays: 90,
    steps: [
      '取出急救包，检查所有物品有效期',
      '测试手电筒、收音机电池是否有电',
      '检查药品是否变质或受潮',
      '补充已过期或缺失的物资',
      '将急救包放回固定位置，并告知全家'
    ]
  },
  { 
    id: '3', 
    title: '地震避险演练', 
    lastPerformed: null, 
    frequencyDays: 180,
    steps: [
      '模拟震感，立即实施“伏地、遮挡、手抓牢”',
      '远离窗户、玻璃和高大柜体',
      '震感停止后，迅速拿起应急包撤离',
      '切勿乘坐电梯，走楼梯逃生',
      '到达空旷地带集合'
    ]
  },
  { 
    id: '4', 
    title: '家庭断电/燃气泄漏演练', 
    lastPerformed: null, 
    frequencyDays: 365,
    steps: [
      '识别燃气泄漏气味（如臭鸡蛋味）',
      '严禁开关电器或使用明火',
      '迅速打开门窗通风',
      '找到燃气总阀并关闭',
      '找到家庭配电箱，演练切断总电源',
      '撤离到室外安全地带报警'
    ]
  },
];
