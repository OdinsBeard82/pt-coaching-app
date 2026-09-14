import { pool } from './db.js';

const programs = [
    {
        title: 'Strength Foundations — 4 Week Full Body',
        description:
            'A 3-day full-body strength base for clients new to structured training. Builds the squat, hinge, push and pull patterns before adding volume.',
        content: {
            weeks: [
                {
                    label: 'Week 1',
                    days: [
                        {
                            label: 'Day 1 — Squat Focus',
                            exercises: [
                                { name: 'Goblet Squat', sets: '4', reps: '10-12', rest: '90 sec', notes: 'Controlled tempo, full depth' },
                                { name: 'Romanian Deadlift', sets: '3', reps: '10', rest: '90 sec', notes: 'Soft knees, feel the hamstrings' },
                                { name: 'Walking Lunge', sets: '3', reps: '12 per leg', rest: '60 sec', notes: '' },
                                { name: 'Plank', sets: '3', reps: '30-40 sec', rest: '45 sec', notes: '' },
                            ],
                        },
                        {
                            label: 'Day 2 — Pull Focus',
                            exercises: [
                                { name: 'Lat Pulldown', sets: '4', reps: '10-12', rest: '75 sec', notes: 'Squeeze at the bottom' },
                                { name: 'Seated Cable Row', sets: '3', reps: '10-12', rest: '75 sec', notes: '' },
                                { name: 'Face Pull', sets: '3', reps: '15', rest: '45 sec', notes: 'Light weight, rear delts' },
                                { name: 'Dead Hang', sets: '3', reps: '20-30 sec', rest: '60 sec', notes: 'Grip and shoulder health' },
                            ],
                        },
                        {
                            label: 'Day 3 — Push Focus',
                            exercises: [
                                { name: 'Dumbbell Bench Press', sets: '4', reps: '10', rest: '90 sec', notes: '' },
                                { name: 'Seated Shoulder Press', sets: '3', reps: '10-12', rest: '75 sec', notes: '' },
                                { name: 'Push Up', sets: '3', reps: 'AMRAP', rest: '60 sec', notes: 'To near failure, good form' },
                                { name: 'Tricep Rope Pushdown', sets: '3', reps: '12-15', rest: '45 sec', notes: '' },
                            ],
                        },
                    ],
                },
                {
                    label: 'Week 2',
                    days: [
                        {
                            label: 'Day 1 — Squat Focus',
                            exercises: [
                                { name: 'Goblet Squat', sets: '4', reps: '10-12', rest: '90 sec', notes: 'Add 2-4kg from week 1' },
                                { name: 'Romanian Deadlift', sets: '3', reps: '10', rest: '90 sec', notes: '' },
                                { name: 'Walking Lunge', sets: '3', reps: '12 per leg', rest: '60 sec', notes: '' },
                                { name: 'Plank', sets: '3', reps: '40-50 sec', rest: '45 sec', notes: '' },
                            ],
                        },
                        {
                            label: 'Day 2 — Pull Focus',
                            exercises: [
                                { name: 'Lat Pulldown', sets: '4', reps: '10-12', rest: '75 sec', notes: 'Add weight if last week felt easy' },
                                { name: 'Seated Cable Row', sets: '3', reps: '10-12', rest: '75 sec', notes: '' },
                                { name: 'Face Pull', sets: '3', reps: '15', rest: '45 sec', notes: '' },
                                { name: 'Dead Hang', sets: '3', reps: '25-35 sec', rest: '60 sec', notes: '' },
                            ],
                        },
                        {
                            label: 'Day 3 — Push Focus',
                            exercises: [
                                { name: 'Dumbbell Bench Press', sets: '4', reps: '10', rest: '90 sec', notes: 'Add 2kg if RPE was under 8' },
                                { name: 'Seated Shoulder Press', sets: '3', reps: '10-12', rest: '75 sec', notes: '' },
                                { name: 'Push Up', sets: '3', reps: 'AMRAP', rest: '60 sec', notes: '' },
                                { name: 'Tricep Rope Pushdown', sets: '3', reps: '12-15', rest: '45 sec', notes: '' },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: 'Pull-Up & Muscle-Up Progression',
        description:
            'A 3-week rig-based programme for clients chasing their first strict pull-up, kipping pull-up, or muscle-up. Needs access to a rig, rings and bands.',
        content: {
            weeks: [
                {
                    label: 'Week 1',
                    days: [
                        {
                            label: 'Day 1 — Pulling Strength',
                            exercises: [
                                { name: 'Band-Assisted Pull-Up', sets: '5', reps: '5', rest: '90 sec', notes: 'Lightest band that lets you complete all reps with control' },
                                { name: 'Ring Row', sets: '4', reps: '10-12', rest: '75 sec', notes: 'Body as horizontal as you can manage' },
                                { name: 'Scapular Pull-Up', sets: '3', reps: '8', rest: '60 sec', notes: 'Dead hang, shoulders only' },
                                { name: 'Straight Arm Lat Pulldown', sets: '3', reps: '12', rest: '60 sec', notes: '' },
                            ],
                        },
                        {
                            label: 'Day 2 — Rig Conditioning',
                            exercises: [
                                { name: 'Kipping Swing Drill', sets: '5', reps: '30 sec', rest: '60 sec', notes: 'Rhythm and hip drive, not height' },
                                { name: 'Toes to Bar', sets: '4', reps: '6-8', rest: '75 sec', notes: 'Sub: knee raises if needed' },
                                { name: 'Dead Hang', sets: '3', reps: 'Max time', rest: '60 sec', notes: 'Grip endurance' },
                                { name: 'Ring Support Hold', sets: '3', reps: '15-20 sec', rest: '60 sec', notes: 'Straight arms, shoulders down' },
                            ],
                        },
                    ],
                },
                {
                    label: 'Week 2',
                    days: [
                        {
                            label: 'Day 1 — Pulling Strength',
                            exercises: [
                                { name: 'Band-Assisted Pull-Up', sets: '5', reps: '5', rest: '90 sec', notes: 'Try a lighter band than week 1' },
                                { name: 'Ring Row', sets: '4', reps: '10-12', rest: '75 sec', notes: 'Slow the eccentric to 3 sec' },
                                { name: 'Scapular Pull-Up', sets: '3', reps: '10', rest: '60 sec', notes: '' },
                                { name: 'Straight Arm Lat Pulldown', sets: '3', reps: '12', rest: '60 sec', notes: '' },
                            ],
                        },
                        {
                            label: 'Day 2 — Rig Conditioning',
                            exercises: [
                                { name: 'Kipping Swing Drill', sets: '5', reps: '30 sec', rest: '60 sec', notes: '' },
                                { name: 'Toes to Bar', sets: '4', reps: '8-10', rest: '75 sec', notes: '' },
                                { name: 'Dead Hang', sets: '3', reps: 'Max time', rest: '60 sec', notes: 'Beat week 1' },
                                { name: 'Ring Support Hold', sets: '3', reps: '20-25 sec', rest: '60 sec', notes: '' },
                            ],
                        },
                    ],
                },
                {
                    label: 'Week 3',
                    days: [
                        {
                            label: 'Day 1 — Pulling Strength',
                            exercises: [
                                { name: 'Strict Pull-Up Attempt', sets: '5', reps: '1-3', rest: '2 min', notes: 'Test where you are — band up if needed' },
                                { name: 'Ring Row', sets: '4', reps: '10-12', rest: '75 sec', notes: '' },
                                { name: 'Weighted Scapular Pull-Up', sets: '3', reps: '8', rest: '75 sec', notes: 'Light vest or DB between feet if available' },
                                { name: 'Straight Arm Lat Pulldown', sets: '3', reps: '12', rest: '60 sec', notes: '' },
                            ],
                        },
                        {
                            label: 'Day 2 — Rig Conditioning',
                            exercises: [
                                { name: 'Kipping Pull-Up Attempt', sets: '5', reps: '3-5', rest: '90 sec', notes: 'Focus on the timing from the drills' },
                                { name: 'Toes to Bar', sets: '4', reps: '10', rest: '75 sec', notes: '' },
                                { name: 'Muscle-Up Transition Drill', sets: '4', reps: '5', rest: '90 sec', notes: 'Low rings, false grip, chest to rings' },
                                { name: 'Ring Support Hold', sets: '3', reps: '25-30 sec', rest: '60 sec', notes: '' },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: 'Online Coaching Starter — Week 1-4 (Minimal Equipment)',
        description:
            'For online/remote clients with dumbbells and bands only. Full-body, 3 sessions a week, designed to be done at home or a small gym.',
        content: {
            weeks: [
                {
                    label: 'Week 1-2',
                    days: [
                        {
                            label: 'Session A',
                            exercises: [
                                { name: 'Dumbbell Goblet Squat', sets: '3', reps: '12', rest: '60 sec', notes: '' },
                                { name: 'Dumbbell Row (each arm)', sets: '3', reps: '12', rest: '60 sec', notes: '' },
                                { name: 'Dumbbell Floor Press', sets: '3', reps: '12', rest: '60 sec', notes: '' },
                                { name: 'Glute Bridge', sets: '3', reps: '15', rest: '45 sec', notes: '' },
                                { name: 'Band Pull-Apart', sets: '3', reps: '15', rest: '30 sec', notes: '' },
                            ],
                        },
                        {
                            label: 'Session B',
                            exercises: [
                                { name: 'Dumbbell Reverse Lunge', sets: '3', reps: '10 per leg', rest: '60 sec', notes: '' },
                                { name: 'Dumbbell Deadlift', sets: '3', reps: '12', rest: '75 sec', notes: 'Hinge at hips, flat back' },
                                { name: 'Dumbbell Shoulder Press', sets: '3', reps: '10', rest: '60 sec', notes: '' },
                                { name: 'Bird Dog', sets: '3', reps: '10 per side', rest: '30 sec', notes: '' },
                                { name: 'Side Plank', sets: '3', reps: '20-30 sec per side', rest: '30 sec', notes: '' },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: 'Kettlebell & Dumbbell Leg Day',
        description:
            "Daniel's own leg day routine — kettlebells, dumbbells and gym machines, built around quad, hamstring and glute work.",
        content: {
            weeks: [
                {
                    label: 'Week 1',
                    days: [
                        {
                            label: 'Leg Day',
                            exercises: [
                                { name: 'Kettlebell Goblet Squat', sets: '4', reps: '10-12', rest: '90 sec', notes: 'Full depth, chest up' },
                                { name: 'Dumbbell Romanian Deadlift', sets: '4', reps: '10', rest: '90 sec', notes: 'Soft knees, hinge from the hips' },
                                { name: 'Leg Press (machine)', sets: '3', reps: '12', rest: '90 sec', notes: '' },
                                { name: 'Kettlebell Walking Lunge', sets: '3', reps: '12 per leg', rest: '75 sec', notes: '' },
                                { name: 'Leg Curl (machine)', sets: '3', reps: '12-15', rest: '60 sec', notes: '' },
                                { name: 'Standing Calf Raise', sets: '3', reps: '15-20', rest: '45 sec', notes: '' },
                            ],
                        },
                    ],
                },
            ],
        },
    },
];

async function main() {
    const coachResult = await pool.query("SELECT id, name FROM users WHERE role = 'coach' ORDER BY created_at ASC LIMIT 1");
    const coach = coachResult.rows[0];
    if (!coach) {
        console.error('No coach account found. Run seed-coach.js first.');
        process.exit(1);
    }

    for (const program of programs) {
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