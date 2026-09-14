// Seeds the 10-level progressive program ladder (Foundation -> Full Advanced Peak).
//
// IMPORTANT: the source document only specified week-by-week SETS/REPS/LOAD
// progression per level, not the actual exercise selections. The exercises
// below are Claude's suggested picks based on each level's name and notes
// (e.g. Level 4's "squat/bench/row" cue, Level 9's named pull-ups/rings/
// handstands). Review them and swap anything you'd rather use — the program
// builder UI lets you edit exercise names, sets, reps, rest and notes freely
// once these are created.
//
// Usage: node src/seed-levels.js
import { pool } from './db.js';

// ---- helpers -------------------------------------------------------------

// Builds a level whose every day follows the SAME weekly sets/reps scheme
// (levels 1, 2, 3, 4, 5, 7). Each day template's exercises keep a fixed
// `rest` and any exercise-specific `notes`; the week's note is appended.
function buildUniformLevel(title, description, dayTemplates, weeklyScheme) {
    const weeks = weeklyScheme.map((w) => ({
        label: `Week ${w.week}`,
        days: dayTemplates.map((day) => ({
            label: day.label,
            exercises: day.exercises.map((ex) => ({
                name: ex.name,
                sets: w.sets,
                reps: ex.repsOverride || w.reps,
                rest: ex.rest,
                notes: [ex.notes, w.note].filter(Boolean).join(' — '),
            })),
        })),
    }));
    return { title, description, content: { weeks } };
}

// ---- Level 1 — Foundation Full Body (4 weeks) -----------------------------

const level1Day = {
    label: 'Full Body',
    exercises: [
        { name: 'Dumbbell Goblet Squat', rest: '90 sec' },
        { name: 'Push-Up', rest: '60 sec', notes: 'Regress to incline/knee push-up if needed' },
        { name: 'Seated Cable Row', rest: '75 sec' },
        { name: 'Glute Bridge', rest: '60 sec' },
        { name: 'Plank', rest: '45 sec', repsOverride: '30-45 sec hold' },
    ],
};
const level1 = buildUniformLevel(
    'Level 1 — Foundation Full Body',
    'A 4-week bodyweight/light-load introduction. Same full-body session 3x/week, building movement quality before adding load.',
    [
        { ...level1Day, label: 'Session A' },
        { ...level1Day, label: 'Session B' },
        { ...level1Day, label: 'Session C' },
    ],
    [
        { week: 1, sets: '3', reps: '10', note: 'Light — learn movement patterns, focus on form' },
        { week: 2, sets: '3', reps: '10', note: 'Same load — refine technique, no load increase yet' },
        { week: 3, sets: '3', reps: '12', note: 'Same load — increase reps before load' },
        { week: 4, sets: '4', reps: '12', note: '+5% load — add a set, small load bump' },
    ]
);

// ---- Level 2 — Foundation Full Body + Tempo (4 weeks) ---------------------

const level2Day = {
    label: 'Full Body (Tempo)',
    exercises: [
        { name: 'Dumbbell Goblet Squat', rest: '90 sec', notes: '3-sec lowering tempo' },
        { name: 'Push-Up', rest: '60 sec', notes: '3-sec lowering tempo' },
        { name: 'Seated Cable Row', rest: '75 sec', notes: '3-sec lowering tempo' },
        { name: 'Glute Bridge', rest: '60 sec', notes: '3-sec lowering tempo' },
        { name: 'Plank', rest: '45 sec', repsOverride: '30-45 sec hold' },
    ],
};
const level2 = buildUniformLevel(
    'Level 2 — Foundation Full Body + Tempo',
    'Same full-body base as Level 1, now with a controlled 3-second lowering tempo on every lift to build control before Level 3.',
    [
        { ...level2Day, label: 'Session A' },
        { ...level2Day, label: 'Session B' },
        { ...level2Day, label: 'Session C' },
    ],
    [
        { week: 1, sets: '3', reps: '10', note: 'Light — introduce 3-second lowering tempo' },
        { week: 2, sets: '3', reps: '10', note: '+5% load — maintain tempo' },
        { week: 3, sets: '3', reps: '12', note: '+5% load — tempo maintained, reps up' },
        { week: 4, sets: '3', reps: '12', note: '+5-10% load — final push before progressing to Level 3' },
    ]
);

// ---- Level 3 — Upper/Lower Split (6 weeks) --------------------------------

const level3Days = [
    {
        label: 'Upper A',
        exercises: [
            { name: 'Barbell Bench Press', rest: '90 sec' },
            { name: 'Seated Cable Row', rest: '75 sec' },
            { name: 'Seated Dumbbell Shoulder Press', rest: '75 sec' },
            { name: 'Lat Pulldown', rest: '75 sec' },
            { name: 'Dumbbell Bicep Curl', rest: '45 sec' },
        ],
    },
    {
        label: 'Lower A',
        exercises: [
            { name: 'Back Squat', rest: '120 sec' },
            { name: 'Romanian Deadlift', rest: '90 sec' },
            { name: 'Leg Press', rest: '90 sec' },
            { name: 'Standing Calf Raise', rest: '45 sec' },
        ],
    },
    {
        label: 'Upper B',
        exercises: [
            { name: 'Incline Dumbbell Press', rest: '75 sec' },
            { name: 'Band-Assisted Pull-Up', rest: '90 sec' },
            { name: 'Dumbbell Lateral Raise', rest: '45 sec' },
            { name: 'Tricep Rope Pushdown', rest: '45 sec' },
        ],
    },
    {
        label: 'Lower B',
        exercises: [
            { name: 'Front Squat', rest: '120 sec' },
            { name: 'Conventional Deadlift', rest: '120 sec' },
            { name: 'Walking Lunge', rest: '75 sec' },
            { name: 'Lying Leg Curl', rest: '60 sec' },
        ],
    },
];
const level3 = buildUniformLevel(
    'Level 3 — Upper/Lower Split',
    'A 6-week 4-day upper/lower split. Builds working weights, then adds a set and pushes load through the back half of the block.',
    level3Days,
    [
        { week: 1, sets: '3', reps: '10-12', note: 'Establish baseline — find comfortable working weight' },
        { week: 2, sets: '3', reps: '10-12', note: '+load — small increase where reps felt easy' },
        { week: 3, sets: '3', reps: '12', note: '+load — push toward top of rep range' },
        { week: 4, sets: '4', reps: '10', note: 'Same load — add 4th set on main lifts' },
        { week: 5, sets: '4', reps: '10', note: '+load — increase load with added set' },
        { week: 6, sets: '4', reps: '8-10', note: '+load (peak) — heaviest week of the block' },
    ]
);

// ---- Level 4 — Intro Push/Pull/Legs (6 weeks) -----------------------------

const level4Days = [
    {
        label: 'Push',
        exercises: [
            { name: 'Barbell Bench Press', rest: '90 sec', notes: 'Main squat/bench/row pattern' },
            { name: 'Seated Dumbbell Shoulder Press', rest: '75 sec' },
            { name: 'Tricep Rope Pushdown', rest: '45 sec' },
        ],
    },
    {
        label: 'Pull',
        exercises: [
            { name: 'Barbell Row', rest: '90 sec', notes: 'Main squat/bench/row pattern' },
            { name: 'Band-Assisted Pull-Up', rest: '90 sec', notes: 'Reduce band assistance as weeks progress' },
            { name: 'Face Pull', rest: '45 sec' },
        ],
    },
    {
        label: 'Legs',
        exercises: [
            { name: 'Back Squat', rest: '120 sec', notes: 'Main squat/bench/row pattern' },
            { name: 'Romanian Deadlift', rest: '90 sec' },
            { name: 'Walking Lunge', rest: '75 sec' },
        ],
    },
];
const level4 = buildUniformLevel(
    'Level 4 — Intro Push/Pull/Legs',
    'A 6-week introduction to the push/pull/legs split, centred on the squat, bench and row patterns. Starts bodyweight/light and introduces barbell loading from week 3.',
    level4Days,
    [
        { week: 1, sets: '3', reps: '8-10', note: 'Bodyweight/light — technical focus on squat/bench/row patterns' },
        { week: 2, sets: '3', reps: '8-10', note: 'Same — reinforce form' },
        { week: 3, sets: '3', reps: '8', note: 'Light barbell introduced — begin loading main lifts' },
        { week: 4, sets: '3', reps: '8', note: 'Moderate load — increase load on main lifts' },
        { week: 5, sets: '4', reps: '8', note: 'Moderate load — add set, reduce pull-up band assistance' },
        { week: 6, sets: '4', reps: '6-8', note: 'Moderate-heavy — fewer assist bands, heaviest week' },
    ]
);

// ---- Level 5 — Full PPL Split (8 weeks) -----------------------------------

const level5Days = [
    {
        label: 'Push',
        exercises: [
            { name: 'Barbell Bench Press', rest: '120 sec' },
            { name: 'Seated Overhead Press', rest: '90 sec' },
            { name: 'Incline Dumbbell Press', rest: '75 sec' },
            { name: 'Dumbbell Lateral Raise', rest: '45 sec' },
            { name: 'Tricep Rope Pushdown', rest: '45 sec' },
        ],
    },
    {
        label: 'Pull',
        exercises: [
            { name: 'Barbell Row', rest: '90 sec' },
            { name: 'Pull-Up', rest: '90 sec' },
            { name: 'Seated Cable Row', rest: '75 sec' },
            { name: 'Face Pull', rest: '45 sec' },
            { name: 'Dumbbell Bicep Curl', rest: '45 sec' },
        ],
    },
    {
        label: 'Legs',
        exercises: [
            { name: 'Back Squat', rest: '150 sec' },
            { name: 'Romanian Deadlift', rest: '90 sec' },
            { name: 'Leg Press', rest: '90 sec' },
            { name: 'Walking Lunge', rest: '75 sec' },
            { name: 'Standing Calf Raise', rest: '45 sec' },
        ],
    },
];
const level5 = buildUniformLevel(
    'Level 5 — Full PPL Split',
    'An 8-week full push/pull/legs rotation with more volume than Level 4. Builds through weeks 1-4, intensifies through weeks 5-7, then deloads.',
    level5Days,
    [
        { week: 1, sets: '3-4', reps: '10-12', note: 'Moderate — establish PPL rotation' },
        { week: 2, sets: '3-4', reps: '10-12', note: '+5% load — linear progression' },
        { week: 3, sets: '4', reps: '10', note: '+5% load — add set on main lifts' },
        { week: 4, sets: '4', reps: '10', note: '+5% load — continue building' },
        { week: 5, sets: '4', reps: '8', note: '+load — begin intensification' },
        { week: 6, sets: '4', reps: '6-8', note: '+load — heavier, lower reps' },
        { week: 7, sets: '4', reps: '6', note: 'Heaviest — peak week' },
        { week: 8, sets: '2-3', reps: '8', note: 'Light (deload) — ~40% volume reduction' },
    ]
);

// ---- Level 6 — PPL + Basketball Conditioning Intro (8 weeks) -------------

const level6LiftingScheme = [
    { week: 1, sets: '3-4', reps: '10-12', note: 'Moderate intensity' },
    { week: 2, sets: '3-4', reps: '10-12', note: 'Consistency week' },
    { week: 3, sets: '3-4', reps: '10-12', note: '+5% load' },
    { week: 4, sets: '3-4', reps: '10-12', note: '+5% load' },
    { week: 5, sets: '4', reps: '6-8', note: 'Intensify' },
    { week: 6, sets: '4', reps: '6-8', note: 'Intensify — consider a 3rd conditioning session if recovery is good' },
    { week: 7, sets: '4', reps: '6-8', note: 'Peak lifting load — heaviest/most explosive week' },
    { week: 8, sets: '2-3', reps: '8', note: 'Deload (~40% volume)' },
];
const level6ConditioningPlan = [
    {
        week: 1, exercises: [
            { name: 'Box Jump', sets: '3', reps: '5', note: 'Moderate intensity, 2x/week' },
            { name: 'Broad Jump', sets: '3', reps: '5', note: 'Moderate intensity, 2x/week' },
        ]
    },
    {
        week: 2, exercises: [
            { name: 'Box Jump', sets: '3', reps: '5', note: 'Consistency week' },
            { name: 'Broad Jump', sets: '3', reps: '5', note: 'Consistency week' },
        ]
    },
    {
        week: 3, exercises: [
            { name: 'Box Jump', sets: '3', reps: '5', note: 'Increase box height slightly' },
            { name: 'Broad Jump', sets: '3', reps: '5', note: '' },
        ]
    },
    {
        week: 4, exercises: [
            { name: 'Box Jump', sets: '3', reps: '5', note: '' },
            { name: 'Broad Jump', sets: '3', reps: '5', note: 'Increase jump distance' },
        ]
    },
    {
        week: 5, exercises: [
            { name: 'Box Jump', sets: '4', reps: '6-8', note: 'Intensify' },
            { name: 'Broad Jump', sets: '4', reps: '6-8', note: 'Intensify' },
            { name: 'Medicine Ball Slam', sets: '4', reps: '6-8', note: 'Newly added this week' },
        ]
    },
    {
        week: 6, exercises: [
            { name: 'Box Jump', sets: '4', reps: '6-8', note: 'Consider a 3rd conditioning session if recovery is good' },
            { name: 'Broad Jump', sets: '4', reps: '6-8', note: '' },
            { name: 'Medicine Ball Slam', sets: '4', reps: '6-8', note: '' },
        ]
    },
    {
        week: 7, exercises: [
            { name: 'Box Jump', sets: '4', reps: '6-8', note: 'Peak jump targets — heaviest/most explosive week' },
            { name: 'Broad Jump', sets: '4', reps: '6-8', note: '' },
            { name: 'Medicine Ball Slam', sets: '4', reps: '6-8', note: '' },
        ]
    },
    {
        week: 8, exercises: [
            { name: 'Box Jump', sets: '2', reps: '5', note: 'Conditioning volume halved — recovery week' },
            { name: 'Broad Jump', sets: '2', reps: '5', note: '' },
        ]
    },
];

const level6 = (() => {
    const lifting = buildUniformLevel('', '', level5Days, level6LiftingScheme).content.weeks;
    const weeks = lifting.map((w, i) => ({
        label: w.label,
        days: [
            ...w.days,
            {
                label: 'Conditioning (2x/week)',
                exercises: level6ConditioningPlan[i].exercises.map((ex) => ({
                    name: ex.name,
                    sets: ex.sets,
                    reps: ex.reps,
                    rest: '90 sec',
                    notes: ex.note,
                })),
            },
        ],
    }));
    return {
        title: 'Level 6 — PPL + Basketball Conditioning Intro',
        description:
            'The Level 5 PPL split plus a twice-weekly conditioning session (box jumps, broad jumps, later medicine ball slams) building toward basketball-specific power.',
        content: { weeks },
    };
})();

// ---- Level 7 — PPL + Full Upper (Advanced Volume) — 12 weeks -------------

const level7Days = [
    {
        label: 'Push',
        exercises: [
            { name: 'Barbell Bench Press', rest: '150 sec' },
            { name: 'Standing Overhead Press', rest: '120 sec' },
            { name: 'Incline Dumbbell Press', rest: '90 sec' },
            { name: 'Cable Fly', rest: '60 sec' },
        ],
    },
    {
        label: 'Pull',
        exercises: [
            { name: 'Weighted Pull-Up', rest: '150 sec' },
            { name: 'Barbell Row', rest: '120 sec' },
            { name: 'Seated Cable Row', rest: '90 sec' },
            { name: 'Face Pull', rest: '45 sec' },
        ],
    },
    {
        label: 'Legs',
        exercises: [
            { name: 'Back Squat', rest: '180 sec' },
            { name: 'Romanian Deadlift', rest: '120 sec' },
            { name: 'Bulgarian Split Squat', rest: '90 sec' },
            { name: 'Lying Leg Curl', rest: '60 sec' },
        ],
    },
    {
        label: 'Full Upper',
        exercises: [
            { name: 'Close-Grip Bench Press', rest: '90 sec' },
            { name: 'Lat Pulldown', rest: '75 sec' },
            { name: 'Dumbbell Lateral Raise', rest: '45 sec' },
            { name: 'Barbell Curl', rest: '60 sec' },
        ],
    },
];
const level7 = buildUniformLevel(
    'Level 7 — PPL + Full Upper (Advanced Volume)',
    'A 12-week advanced-volume block: PPL plus a dedicated extra upper day, moving from accumulation to intensification to a heavy peak, then deloading.',
    level7Days,
    [
        { week: 1, sets: '4', reps: '6-8', note: 'Moderate-heavy — accumulation' },
        { week: 2, sets: '4', reps: '6-8', note: '+load — accumulation' },
        { week: 3, sets: '4', reps: '6-8', note: '+load — accumulation' },
        { week: 4, sets: '4', reps: '6-8', note: '+load — accumulation' },
        { week: 5, sets: '4', reps: '4-6', note: '+load — intensification' },
        { week: 6, sets: '4', reps: '4-6', note: '+load — intensification' },
        { week: 7, sets: '4', reps: '4-6', note: '+load — intensification' },
        { week: 8, sets: '4', reps: '4-6', note: '+load — intensification' },
        { week: 9, sets: 'Top sets', reps: '3-5', note: 'Heavy — peak' },
        { week: 10, sets: 'Top sets', reps: '3-5', note: 'Heavier — peak' },
        { week: 11, sets: 'Top sets', reps: '3-5', note: 'Heaviest — peak' },
        { week: 12, sets: '2-3', reps: '8', note: 'Light — deload' },
    ]
);

// ---- Level 8 — Explosive Power Phase (8 weeks) ----------------------------

const level8Plan = [
    { week: 1, sets: '4', reps: '3', note: 'Technical priority — power clean & jump technique, moderate load' },
    { week: 2, sets: '4', reps: '3', note: 'Refine mechanics, moderate load' },
    { week: 3, sets: '4', reps: '3', note: 'Consolidate movement quality, moderate load' },
    { week: 4, sets: '4', reps: '3', note: 'Begin progressive overload — load/height increase' },
    { week: 5, sets: '5', reps: '3', note: 'Load/height increase' },
    { week: 6, sets: '5', reps: '2-3', note: 'Load/height increase' },
    { week: 7, sets: '5', reps: '1-3', note: 'Peak week — heaviest technical singles/triples, max jump attempts' },
    { week: 8, sets: '2-3', reps: '3', note: 'Deload — light technical work only, no max efforts' },
];
const level8 = {
    title: 'Level 8 — Explosive Power Phase',
    description:
        'An 8-week power-focused block built around the power clean and jump training. Starts as pure technique work, then loads/heights build to a peak, then deloads.',
    content: {
        weeks: level8Plan.map((w) => ({
            label: `Week ${w.week}`,
            days: [
                {
                    label: 'Power & Jump Training',
                    exercises: [
                        { name: 'Power Clean', sets: w.sets, reps: w.reps, rest: '150 sec', notes: w.note },
                        { name: 'Box Jump', sets: w.sets, reps: w.reps, rest: '120 sec', notes: w.note },
                        { name: 'Push Press', sets: w.sets, reps: w.reps, rest: '120 sec', notes: w.note },
                        { name: 'Broad Jump', sets: w.sets, reps: w.reps, rest: '90 sec', notes: w.note },
                    ],
                },
            ],
        })),
    },
};

// ---- Level 9 — Calisthenics Integration (8 weeks) -------------------------

const level9Weeks = [
    {
        week: 1, exercises: [
            { name: 'Weighted Pull-Up', sets: '4', reps: '5', rest: '120 sec', notes: 'Build base strength' },
            { name: 'Ring Dip', sets: '4', reps: '6-8', rest: '90 sec', notes: 'Build base strength' },
            { name: 'Wall Handstand Hold', sets: '4', reps: '20-30 sec', rest: '60 sec', notes: 'Build base strength' },
        ]
    },
    {
        week: 2, exercises: [
            { name: 'Weighted Pull-Up', sets: '4', reps: '5', rest: '120 sec', notes: '' },
            { name: 'Ring Dip', sets: '4', reps: '6-8', rest: '90 sec', notes: '' },
            { name: 'Wall Handstand Hold', sets: '4', reps: 'Toward 45 sec', rest: '60 sec', notes: 'Extend hold toward 45s' },
        ]
    },
    {
        week: 3, exercises: [
            { name: 'Weighted Pull-Up', sets: '4', reps: '5', rest: '120 sec', notes: 'Base strength consolidated' },
            { name: 'Ring Dip', sets: '4', reps: '6-8', rest: '90 sec', notes: '' },
            { name: 'Wall Handstand Hold', sets: '4', reps: 'Toward 60 sec', rest: '60 sec', notes: 'Extend hold toward 60s' },
        ]
    },
    {
        week: 4, exercises: [
            { name: 'Weighted Pull-Up', sets: '3', reps: '5', rest: '120 sec', notes: '' },
            { name: 'Ring Dip', sets: '3', reps: '6-8', rest: '90 sec', notes: '' },
            { name: 'Muscle-Up Transition Drill', sets: '4', reps: '5', rest: '90 sec', notes: 'Newly introduced' },
            { name: 'Wall Handstand Hold', sets: '3', reps: '60 sec', rest: '60 sec', notes: '' },
        ]
    },
    {
        week: 5, exercises: [
            { name: 'Weighted Pull-Up', sets: '3', reps: '5', rest: '120 sec', notes: '' },
            { name: 'Ring Dip', sets: '3', reps: '6-8', rest: '90 sec', notes: '' },
            { name: 'Muscle-Up Transition Drill', sets: '4', reps: '5', rest: '90 sec', notes: '' },
            { name: 'Chest-to-Wall Handstand Hold', sets: '3', reps: '20-30 sec', rest: '60 sec', notes: 'Newly introduced' },
        ]
    },
    {
        week: 6, exercises: [
            { name: 'Muscle-Up Attempt', sets: '5', reps: '1-2', rest: '150 sec', notes: 'First muscle-up rep attempts' },
            { name: 'Ring Dip', sets: '3', reps: '6-8', rest: '90 sec', notes: '' },
            { name: 'Chest-to-Wall Handstand Hold', sets: '3', reps: '30 sec', rest: '60 sec', notes: '' },
        ]
    },
    {
        week: 7, exercises: [
            { name: 'Muscle-Up Attempt', sets: '5', reps: '1-2', rest: '150 sec', notes: '' },
            { name: 'Freestanding Handstand Kick-Up', sets: '5', reps: '5 attempts', rest: '60 sec', notes: 'Newly introduced' },
            { name: 'Chest-to-Wall Handstand Hold', sets: '3', reps: '30 sec', rest: '60 sec', notes: '' },
        ]
    },
    {
        week: 8, exercises: [
            { name: 'Muscle-Up', sets: '5', reps: '1-3', rest: '150 sec', notes: 'Consolidate muscle-up reps — end of block' },
            { name: 'Freestanding Handstand Kick-Up', sets: '5', reps: '5 attempts', rest: '60 sec', notes: '' },
        ]
    },
];
const level9 = {
    title: 'Level 9 — Calisthenics Integration',
    description:
        'An 8-week bodyweight/rings block building from weighted pull-ups and dip strength toward a first strict muscle-up and freestanding handstand kick-up.',
    content: {
        weeks: level9Weeks.map((w) => ({
            label: `Week ${w.week}`,
            days: [{ label: 'Calisthenics Session', exercises: w.exercises }],
        })),
    },
};

// ---- Level 10 — Full Advanced Program (Peak) — 12 weeks -------------------

const level10Phases = [
    { weeks: [1, 2, 3, 4], phase: 'Base', liftNote: 'Full split, moderate-high volume', skillNote: 'Maintain muscle-up/handstand reps', liftSets: '4', liftReps: '8' },
    { weeks: [5, 6, 7, 8], phase: 'Build', liftNote: 'Increase intensity on lifts/power', skillNote: 'Push toward new skill reps/holds', liftSets: '4', liftReps: '6' },
    { weeks: [9, 10, 11], phase: 'Peak', liftNote: 'Highest intensity, heaviest lifts', skillNote: 'Max attempts', liftSets: '4', liftReps: '3-5' },
];
const level10DeloadWeek = { week: 12, phase: 'Deload', liftNote: 'Full deload — volume and intensity cut significantly', skillNote: 'Light maintenance only', liftSets: '2', liftReps: '8' };

function level10WeekEntry(weekNum, phase, liftNote, skillNote, liftSets, liftReps) {
    return {
        label: `Week ${weekNum} (${phase})`,
        days: [
            {
                label: 'Full Split — Lifting/Power',
                exercises: [
                    { name: 'Back Squat', sets: liftSets, reps: liftReps, rest: '150 sec', notes: liftNote },
                    { name: 'Barbell Bench Press', sets: liftSets, reps: liftReps, rest: '120 sec', notes: liftNote },
                    { name: 'Weighted Pull-Up', sets: liftSets, reps: liftReps, rest: '120 sec', notes: liftNote },
                    { name: 'Power Clean', sets: liftSets, reps: liftReps, rest: '150 sec', notes: liftNote },
                ],
            },
            {
                label: 'Skill Work',
                exercises: [
                    { name: 'Muscle-Up', sets: '4', reps: '1-3', rest: '150 sec', notes: skillNote },
                    { name: 'Freestanding Handstand Hold', sets: '4', reps: '15-30 sec', rest: '60 sec', notes: skillNote },
                ],
            },
        ],
    };
}

const level10Weeks = [];
for (const block of level10Phases) {
    for (const weekNum of block.weeks) {
        level10Weeks.push(
            level10WeekEntry(weekNum, block.phase, block.liftNote, block.skillNote, block.liftSets, block.liftReps)
        );
    }
}
level10Weeks.push(
    level10WeekEntry(
        level10DeloadWeek.week,
        level10DeloadWeek.phase,
        level10DeloadWeek.liftNote,
        level10DeloadWeek.skillNote,
        level10DeloadWeek.liftSets,
        level10DeloadWeek.liftReps
    )
);

const level10 = {
    title: 'Level 10 — Full Advanced Program (Peak)',
    description:
        'The 12-week capstone block: full lifting/power split alongside maintained muscle-up and handstand skill work, moving through base, build and peak phases before a full deload.',
    content: { weeks: level10Weeks },
};

// ---- write everything ------------------------------------------------------

const allLevels = [level1, level2, level3, level4, level5, level6, level7, level8, level9, level10];

async function main() {
    const coachResult = await pool.query("SELECT id, name FROM users WHERE role = 'coach' ORDER BY created_at ASC LIMIT 1");
    const coach = coachResult.rows[0];
    if (!coach) {
        console.error('No coach account found. Run seed-coach.js first.');
        process.exit(1);
    }

    for (const program of allLevels) {
        const existing = await pool.query('SELECT id FROM programs WHERE title = $1', [program.title]);
        if (existing.rows.length) {
            console.log(`Skipping "${program.title}" — already exists.`);
            continue;
        }
        await pool.query(
            `INSERT INTO programs (title, description, content, created_by) VALUES ($1, $2, $3, $4)`,
            [program.title, program.description, program.content, coach.id]
        );
        console.log(`Created program: "${program.title}"`);
    }

    await pool.end();
    console.log('Done.');
}

main().catch((err) => {
    console.error('Seeding failed:', err.message);
    process.exit(1);
});