
-- ================================================================
-- CBC Kenya Curriculum — Complete Seed Data (Fixed Codes)
-- Compatible with your exact schema (code field is VARCHAR(10))
--
-- Run in Supabase SQL Editor. Safe to re-run (ON CONFLICT DO NOTHING).
-- ================================================================

-- First delete existing data
DELETE FROM competencies C USING sub_strands SS, strands S, learning_areas LA 
WHERE C.sub_strand_id = SS.id AND SS.strand_id = S.id AND S.learning_area_id = LA.id 
AND LA.school_id IS NULL;

DELETE FROM sub_strands SS USING strands S, learning_areas LA 
WHERE SS.strand_id = S.id AND S.learning_area_id = LA.id AND LA.school_id IS NULL;

DELETE FROM strands S USING learning_areas LA 
WHERE S.learning_area_id = LA.id AND LA.school_id IS NULL;

DELETE FROM learning_areas WHERE school_id IS NULL;

-- =====================================================
-- 1. LEARNING AREAS (code max 10 chars)
-- =====================================================

INSERT INTO public.learning_areas (id, name, code, description, school_id, is_active, created_at, updated_at, grade_levels) VALUES

-- Pre-Primary
(md5('pp_lang')::uuid,          'Language Activities',                    'PPLANG',      'Development of pre-reading and pre-writing skills',         NULL, true, NOW(), NOW(), ARRAY['PP1','PP2']),
(md5('pp_math')::uuid,          'Mathematical Activities',                'PPMATH',      'Foundational numeracy skills',                              NULL, true, NOW(), NOW(), ARRAY['PP1','PP2']),
(md5('pp_env')::uuid,           'Environmental Activities',               'PPENV',       'Awareness of self and environment',                         NULL, true, NOW(), NOW(), ARRAY['PP1','PP2']),
(md5('pp_psychomotor')::uuid,   'Psychomotor and Creative Activities',    'PPPSY',       'Physical development and creativity',                       NULL, true, NOW(), NOW(), ARRAY['PP1','PP2']),
(md5('pp_re')::uuid,            'Religious Education Activities',         'PPRE',        'Moral and spiritual development',                           NULL, true, NOW(), NOW(), ARRAY['PP1','PP2']),

-- Lower Primary
(md5('lp_literacy')::uuid,      'Literacy Activities',                    'LPLIT',       'Reading and writing foundation',                            NULL, true, NOW(), NOW(), ARRAY['Grade 1','Grade 2','Grade 3']),
(md5('lp_english')::uuid,       'English Language Activities',            'LPENG',       'English language skills',                                   NULL, true, NOW(), NOW(), ARRAY['Grade 1','Grade 2','Grade 3']),
(md5('lp_kiswahili')::uuid,     'Kiswahili Language Activities',          'LPKIS',       'Kiswahili language skills',                                 NULL, true, NOW(), NOW(), ARRAY['Grade 1','Grade 2','Grade 3']),
(md5('lp_indigenous')::uuid,    'Indigenous Language Activities',         'LPIND',       'Mother tongue development',                                 NULL, true, NOW(), NOW(), ARRAY['Grade 1','Grade 2','Grade 3']),
(md5('lp_math')::uuid,          'Mathematical Activities',                'LPMATH',      'Numeracy skills',                                           NULL, true, NOW(), NOW(), ARRAY['Grade 1','Grade 2','Grade 3']),
(md5('lp_hygiene')::uuid,       'Hygiene and Nutrition Activities',       'LPHYG',       'Health and nutrition',                                      NULL, true, NOW(), NOW(), ARRAY['Grade 1','Grade 2','Grade 3']),
(md5('lp_re')::uuid,            'Religious Education Activities',         'LPRE',        'Moral education',                                           NULL, true, NOW(), NOW(), ARRAY['Grade 1','Grade 2','Grade 3']),
(md5('lp_movement')::uuid,      'Movement and Creative Activities',       'LPMOVE',      'Physical and creative expression',                          NULL, true, NOW(), NOW(), ARRAY['Grade 1','Grade 2','Grade 3']),

-- Upper Primary
(md5('up_english')::uuid,       'English',                                'UPENG',       'English language and literature',                           NULL, true, NOW(), NOW(), ARRAY['Grade 4','Grade 5','Grade 6']),
(md5('up_kiswahili')::uuid,     'Kiswahili',                              'UPKIS',       'Kiswahili language',                                        NULL, true, NOW(), NOW(), ARRAY['Grade 4','Grade 5','Grade 6']),
(md5('up_homescience')::uuid,   'Home Science',                           'UPHSC',       'Practical home management skills',                          NULL, true, NOW(), NOW(), ARRAY['Grade 4','Grade 5','Grade 6']),
(md5('up_agriculture')::uuid,   'Agriculture',                            'UPAGR',       'Farming and food production',                               NULL, true, NOW(), NOW(), ARRAY['Grade 4','Grade 5','Grade 6']),
(md5('up_science')::uuid,       'Science and Technology',                 'UPSCI',       'Scientific inquiry and technology',                         NULL, true, NOW(), NOW(), ARRAY['Grade 4','Grade 5','Grade 6']),
(md5('up_math')::uuid,          'Mathematics',                            'UPMATH',      'Advanced numeracy',                                         NULL, true, NOW(), NOW(), ARRAY['Grade 4','Grade 5','Grade 6']),
(md5('up_re')::uuid,            'Religious Education',                    'UPRE',        'Religious and moral education',                             NULL, true, NOW(), NOW(), ARRAY['Grade 4','Grade 5','Grade 6']),
(md5('up_creative')::uuid,      'Creative Arts',                         'UPCRT',       'Art, music and creative expression',                        NULL, true, NOW(), NOW(), ARRAY['Grade 4','Grade 5','Grade 6']),
(md5('up_pe')::uuid,            'Physical and Health Education',          'UPPE',        'Physical fitness and health',                               NULL, true, NOW(), NOW(), ARRAY['Grade 4','Grade 5','Grade 6']),
(md5('up_social')::uuid,        'Social Studies',                         'UPSS',        'History, geography and citizenship',                        NULL, true, NOW(), NOW(), ARRAY['Grade 4','Grade 5','Grade 6']),

-- Junior Secondary
(md5('js_english')::uuid,               'English',                                   'JSENG',       'Advanced English language and literature',           NULL, true, NOW(), NOW(), ARRAY['Grade 7','Grade 8','Grade 9']),
(md5('js_kiswahili')::uuid,             'Kiswahili',                                 'JSKIS',       'Advanced Kiswahili language and literature',         NULL, true, NOW(), NOW(), ARRAY['Grade 7','Grade 8','Grade 9']),
(md5('js_math')::uuid,                  'Mathematics',                               'JSMATH',      'Advanced mathematical concepts',                    NULL, true, NOW(), NOW(), ARRAY['Grade 7','Grade 8','Grade 9']),
(md5('js_integrated_science')::uuid,    'Integrated Science',                        'JSSCI',       'Combined scientific disciplines',                   NULL, true, NOW(), NOW(), ARRAY['Grade 7','Grade 8','Grade 9']),
(md5('js_health')::uuid,                'Health Education',                          'JSHLT',       'Personal and community health',                     NULL, true, NOW(), NOW(), ARRAY['Grade 7','Grade 8','Grade 9']),
(md5('js_pretech')::uuid,               'Pre-Technical and Pre-Career Education',    'JSPTE',       'Foundational technical and career skills',           NULL, true, NOW(), NOW(), ARRAY['Grade 7','Grade 8','Grade 9']),
(md5('js_social')::uuid,                'Social Studies',                            'JSSS',        'History, geography and citizenship',                NULL, true, NOW(), NOW(), ARRAY['Grade 7','Grade 8','Grade 9']),
(md5('js_re')::uuid,                    'Religious Education',                       'JSRE',        'Religious education (CRE/IRE/HRE)',                 NULL, true, NOW(), NOW(), ARRAY['Grade 7','Grade 8','Grade 9']),
(md5('js_business')::uuid,              'Business Studies',                          'JSBUS',       'Basic business concepts',                           NULL, true, NOW(), NOW(), ARRAY['Grade 7','Grade 8','Grade 9']),
(md5('js_agriculture')::uuid,           'Agriculture',                               'JSAGR',       'Farming and food production',                       NULL, true, NOW(), NOW(), ARRAY['Grade 7','Grade 8','Grade 9']),
(md5('js_lifeskills')::uuid,            'Life Skills Education',                     'JSLSK',       'Personal and interpersonal skills',                 NULL, true, NOW(), NOW(), ARRAY['Grade 7','Grade 8','Grade 9']),
(md5('js_sports')::uuid,                'Sports and Physical Education',             'JSSPT',       'Physical fitness and sports skills',                NULL, true, NOW(), NOW(), ARRAY['Grade 7','Grade 8','Grade 9']),
(md5('js_optional_visual_arts')::uuid,      'Visual Arts (Optional)',            'JSVIS',   'Optional visual arts subject',         NULL, true, NOW(), NOW(), ARRAY['Grade 7','Grade 8','Grade 9']),
(md5('js_optional_performing_arts')::uuid,  'Performing Arts (Optional)',        'JSPER',   'Optional performing arts subject',     NULL, true, NOW(), NOW(), ARRAY['Grade 7','Grade 8','Grade 9']),
(md5('js_optional_computer')::uuid,         'Computer Science (Optional)',       'JSCSC',   'Optional computer science subject',    NULL, true, NOW(), NOW(), ARRAY['Grade 7','Grade 8','Grade 9'])

ON CONFLICT (id) DO NOTHING;


-- =====================================================
-- 2. STRANDS (code max 10 chars)
-- =====================================================

INSERT INTO public.strands (id, learning_area_id, name, code, description, is_active, created_at, updated_at) VALUES

(md5('pp_lang_listening')::uuid,        md5('pp_lang')::uuid,               'Listening and Speaking',           'PPLGLS',       'Oral language development',                        true, NOW(), NOW()),
(md5('pp_lang_reading')::uuid,          md5('pp_lang')::uuid,               'Reading Readiness',                'PPLGRR',       'Pre-reading skills',                               true, NOW(), NOW()),
(md5('pp_math_classification')::uuid,   md5('pp_math')::uuid,               'Classification',                   'PPMCLS',      'Sorting and grouping objects',                     true, NOW(), NOW()),
(md5('pp_math_numbers')::uuid,          md5('pp_math')::uuid,               'Number Concepts',                  'PPMNUM',      'Understanding numbers',                            true, NOW(), NOW()),
(md5('pp_math_measurement')::uuid,      md5('pp_math')::uuid,               'Measurement',                      'PPMMEA',      'Basic measurement concepts',                       true, NOW(), NOW()),
(md5('lp_lit_reading')::uuid,           md5('lp_literacy')::uuid,           'Reading',                          'LPLRDR',      'Reading skills development',                       true, NOW(), NOW()),
(md5('lp_math_numbers')::uuid,          md5('lp_math')::uuid,               'Numbers',                          'LPMNUM',      'Number concepts and operations',                   true, NOW(), NOW()),
(md5('up_eng_grammar')::uuid,           md5('up_english')::uuid,            'Grammar',                          'UPENGR',      'English grammar rules',                            true, NOW(), NOW()),
(md5('up_sci_living')::uuid,            md5('up_science')::uuid,            'Living Things',                    'UPSCLV',      'Study of living organisms',                        true, NOW(), NOW()),
(md5('up_math_numbers')::uuid,          md5('up_math')::uuid,               'Numbers',                          'UPMNUM',      'Number operations',                                true, NOW(), NOW()),
(md5('up_math_fractions')::uuid,        md5('up_math')::uuid,               'Fractions',                        'UPMFRA',      'Fraction concepts',                                true, NOW(), NOW()),
(md5('up_ss_community')::uuid,          md5('up_social')::uuid,             'Our Community',                    'UPSSCO',      'Community awareness',                              true, NOW(), NOW()),
(md5('js_eng_grammar')::uuid,           md5('js_english')::uuid,            'Grammar in Use',                   'JSENGR',      'Advanced grammar',                                 true, NOW(), NOW()),
(md5('js_eng_composition')::uuid,       md5('js_english')::uuid,            'Composition Writing',              'JSENCP',      'Essay writing skills',                             true, NOW(), NOW()),
(md5('js_math_numbers')::uuid,          md5('js_math')::uuid,               'Numbers',                          'JSMNUM',      'Advanced number concepts',                         true, NOW(), NOW()),
(md5('js_math_algebra')::uuid,          md5('js_math')::uuid,               'Algebra',                          'JSALG',      'Algebraic concepts',                               true, NOW(), NOW()),
(md5('js_math_geometry')::uuid,         md5('js_math')::uuid,               'Geometry',                         'JSGEO',      'Geometric concepts',                               true, NOW(), NOW()),
(md5('js_sci_living')::uuid,            md5('js_integrated_science')::uuid, 'Living Things and Their Environment', 'JSSCLV',   'Biology concepts',                                 true, NOW(), NOW()),
(md5('js_sci_matter')::uuid,            md5('js_integrated_science')::uuid, 'Matter and Interactions',          'JSSCMT',      'Chemistry concepts',                               true, NOW(), NOW()),
(md5('js_sci_energy')::uuid,            md5('js_integrated_science')::uuid, 'Energy',                           'JSSCE',       'Physics concepts',                                 true, NOW(), NOW()),
(md5('js_health_nutrition')::uuid,      md5('js_health')::uuid,             'Nutrition',                        'JSHLTN',      'Food and nutrition',                               true, NOW(), NOW()),
(md5('js_pretech_materials')::uuid,     md5('js_pretech')::uuid,            'Materials',                        'JSPTEM',      'Properties of materials',                          true, NOW(), NOW()),
(md5('js_pretech_drawing')::uuid,       md5('js_pretech')::uuid,            'Technical Drawing',                'JSPTDR',      'Basic technical drawing',                          true, NOW(), NOW()),
(md5('js_social_history')::uuid,        md5('js_social')::uuid,             'History and Government',           'JSSSH',       'Kenyan history',                                   true, NOW(), NOW()),
(md5('js_social_geography')::uuid,      md5('js_social')::uuid,             'Geography',                        'JSSSG',       'Geographical concepts',                            true, NOW(), NOW()),
(md5('js_business_intro')::uuid,        md5('js_business')::uuid,           'Introduction to Business',         'JSBUSI',      'Basic business concepts',                          true, NOW(), NOW()),
(md5('js_business_enterprise')::uuid,   md5('js_business')::uuid,           'Enterprise',                       'JSBUSE',      'Entrepreneurship skills',                          true, NOW(), NOW()),
(md5('js_agriculture_crops')::uuid,     md5('js_agriculture')::uuid,        'Crop Production',                  'JSAGRP',      'Farming techniques',                               true, NOW(), NOW()),
(md5('js_lifeskills_self')::uuid,       md5('js_lifeskills')::uuid,         'Self-Awareness',                   'JSLSKS',      'Personal development',                             true, NOW(), NOW()),
(md5('js_lifeskills_social')::uuid,     md5('js_lifeskills')::uuid,         'Social Skills',                    'JSLSKSO',     'Interpersonal skills',                             true, NOW(), NOW()),
(md5('js_sports_games')::uuid,          md5('js_sports')::uuid,             'Games',                            'JSSPTG',      'Sports and games',                                 true, NOW(), NOW()),
(md5('js_optional_computer_basics')::uuid, md5('js_optional_computer')::uuid, 'Computer Basics',               'JSCSCB',     'Fundamental computer concepts',                    true, NOW(), NOW())

ON CONFLICT (id) DO NOTHING;


-- =====================================================
-- 3. SUB-STRANDS (code max 10 chars)
-- =====================================================

INSERT INTO public.sub_strands (id, strand_id, name, code, description, is_active, created_at, updated_at) VALUES

(md5('pp_lang_listening_compre')::uuid, md5('pp_lang_listening')::uuid,         'Listening Comprehension',              'PPLGLC1',    'Understanding spoken language',                        true, NOW(), NOW()),
(md5('pp_lang_vocab')::uuid,            md5('pp_lang_listening')::uuid,         'Vocabulary Development',               'PPLGLC2',    'Building vocabulary',                                  true, NOW(), NOW()),
(md5('pp_lang_print_awareness')::uuid,  md5('pp_lang_reading')::uuid,           'Print Awareness',                      'PPLGRR1',    'Understanding books and print',                        true, NOW(), NOW()),
(md5('pp_lang_phonemic')::uuid,         md5('pp_lang_reading')::uuid,           'Phonemic Awareness',                   'PPLGRR2',    'Sound recognition',                                    true, NOW(), NOW()),
(md5('pp_math_sorting')::uuid,          md5('pp_math_classification')::uuid,    'Sorting and Grouping',                 'PPMCLS1',    'Classifying objects',                                  true, NOW(), NOW()),
(md5('pp_math_counting')::uuid,         md5('pp_math_numbers')::uuid,           'Counting 1-5 (PP1) / 1-20 (PP2)',      'PPMNUM1',    'Number counting skills',                               true, NOW(), NOW()),
(md5('pp_math_mass')::uuid,             md5('pp_math_measurement')::uuid,       'Mass (Heavy and Light)',               'PPMMEA2',    'Comparing weight',                                     true, NOW(), NOW()),
(md5('lp_lit_reading_fluency')::uuid,   md5('lp_lit_reading')::uuid,            'Reading Fluency',                      'LPLRDR1',    'Smooth reading',                                       true, NOW(), NOW()),
(md5('lp_math_numbers_1_100')::uuid,    md5('lp_math_numbers')::uuid,           'Number Concepts 1-100',                'LPMNUM1',    'Numbers up to 100',                                    true, NOW(), NOW()),
(md5('up_eng_grammar_sentences')::uuid, md5('up_eng_grammar')::uuid,            'Sentence Structure',                   'UPENGR1',    'Building sentences',                                   true, NOW(), NOW()),
(md5('up_sci_plants')::uuid,            md5('up_sci_living')::uuid,             'Plants',                               'UPSCLV1',    'Plant biology',                                        true, NOW(), NOW()),
(md5('up_math_operations')::uuid,       md5('up_math_numbers')::uuid,           'Operations with Whole Numbers',        'UPMNUM1',    'Addition, subtraction, multiplication, division',      true, NOW(), NOW()),
(md5('up_math_fractions_basic')::uuid,  md5('up_math_fractions')::uuid,         'Common Fractions',                     'UPMFRA1',    'Basic fraction concepts',                              true, NOW(), NOW()),
(md5('up_ss_community_resources')::uuid, md5('up_ss_community')::uuid,          'Community Resources',                  'UPSSCO1',    'Local resources and services',                         true, NOW(), NOW()),
(md5('js_eng_grammar_tenses')::uuid,    md5('js_eng_grammar')::uuid,            'Verb Tenses',                          'JSENGR1',    'Using correct tenses',                                 true, NOW(), NOW()),
(md5('js_eng_comp_essay')::uuid,        md5('js_eng_composition')::uuid,        'Essay Writing',                        'JSENCP1',    'Writing compositions',                                 true, NOW(), NOW()),
(md5('js_math_integers')::uuid,         md5('js_math_numbers')::uuid,           'Integers',                             'JSMNUM1',    'Positive and negative numbers',                        true, NOW(), NOW()),
(md5('js_math_algebra_expressions')::uuid, md5('js_math_algebra')::uuid,        'Algebraic Expressions',                'JSALG1',     'Working with variables',                               true, NOW(), NOW()),
(md5('js_math_geo_angles')::uuid,       md5('js_math_geometry')::uuid,          'Angles',                               'JSGEO1',     'Types and properties of angles',                       true, NOW(), NOW()),
(md5('js_sci_cells')::uuid,             md5('js_sci_living')::uuid,             'Cells and Organisms',                  'JSSCLV1',    'Cell structure',                                       true, NOW(), NOW()),
(md5('js_sci_states')::uuid,            md5('js_sci_matter')::uuid,             'States of Matter',                     'JSSCMT1',    'Solids, liquids, gases',                               true, NOW(), NOW()),
(md5('js_sci_energy_forms')::uuid,      md5('js_sci_energy')::uuid,             'Forms of Energy',                      'JSSCE1',     'Types of energy',                                     true, NOW(), NOW()),
(md5('js_health_nutrition_balanced')::uuid, md5('js_health_nutrition')::uuid,   'Balanced Diet',                        'JSHLTN1',    'Healthy eating',                                       true, NOW(), NOW()),
(md5('js_pretech_materials_properties')::uuid, md5('js_pretech_materials')::uuid, 'Properties of Materials',            'JSPTEM1',    'Material characteristics',                             true, NOW(), NOW()),
(md5('js_pretech_drawing_basic')::uuid, md5('js_pretech_drawing')::uuid,         'Basic Technical Drawing',             'JSPTDR1',    'Introduction to technical drawing',                    true, NOW(), NOW()),
(md5('js_social_history_kenya')::uuid,  md5('js_social_history')::uuid,         'History of Kenya',                     'JSSSH1',     'Kenyan historical events',                             true, NOW(), NOW()),
(md5('js_social_geography_map')::uuid,  md5('js_social_geography')::uuid,       'Map Work',                             'JSSSG1',     'Reading and interpreting maps',                        true, NOW(), NOW()),
(md5('js_business_needs')::uuid,        md5('js_business_intro')::uuid,         'Needs and Wants',                      'JSBUSI1',    'Understanding needs vs wants',                         true, NOW(), NOW()),
(md5('js_business_entrepreneurship')::uuid, md5('js_business_enterprise')::uuid,'Entrepreneurship',                     'JSBUSE1',    'Business skills',                                      true, NOW(), NOW()),
(md5('js_agriculture_crops_growing')::uuid, md5('js_agriculture_crops')::uuid,  'Growing Crops',                        'JSAGRP1',    'Cultivation techniques',                               true, NOW(), NOW()),
(md5('js_lifeskills_self_esteem')::uuid,    md5('js_lifeskills_self')::uuid,     'Self-Esteem',                          'JSLSKS1',    'Building confidence',                                  true, NOW(), NOW()),
(md5('js_lifeskills_communication')::uuid,  md5('js_lifeskills_social')::uuid,   'Effective Communication',              'JSLSKSO1',   'Communication skills',                                 true, NOW(), NOW()),
(md5('js_sports_games_ball')::uuid,     md5('js_sports_games')::uuid,           'Ball Games',                           'JSSPTG1',    'Playing with balls',                                   true, NOW(), NOW()),
(md5('js_optional_computer_hardware')::uuid, md5('js_optional_computer_basics')::uuid, 'Computer Hardware',             'JSCSCB1',    'Computer components',                                  true, NOW(), NOW())

ON CONFLICT (id) DO NOTHING;


-- =====================================================
-- 4. COMPETENCIES
-- =====================================================

INSERT INTO public.competencies (id, sub_strand_id, name, description, indicators, performance_indicators, is_active, created_at, updated_at) VALUES

(md5('pp_lang_listen_stories')::uuid,       md5('pp_lang_listening_compre')::uuid,
 'Listen to simple stories and respond to questions', 'Learner listens to simple stories and answers oral questions',
 ARRAY['Listen attentively','Respond to questions','Retell events'],
 ARRAY['Listen attentively for at least 5 minutes','Respond correctly to simple questions about the story','Retell simple events from the story'],
 true, NOW(), NOW()),

(md5('pp_lang_follow_instructions')::uuid,  md5('pp_lang_listening_compre')::uuid,
 'Follow simple instructions', 'Learner follows simple oral instructions',
 ARRAY['Follow instructions','Demonstrate understanding'],
 ARRAY['Follow one-step instructions','Follow two-step instructions','Demonstrate understanding through actions'],
 true, NOW(), NOW()),

(md5('pp_lang_new_words')::uuid,            md5('pp_lang_vocab')::uuid,
 'Use new words in daily communication', 'Learner acquires and uses new vocabulary',
 ARRAY['Pronounce words','Use in sentences','Identify objects'],
 ARRAY['Pronounce new words correctly','Use new words in simple sentences','Identify objects by name'],
 true, NOW(), NOW()),

(md5('pp_lang_handle_book')::uuid,          md5('pp_lang_print_awareness')::uuid,
 'Handle books appropriately', 'Learner demonstrates proper book handling skills',
 ARRAY['Hold book','Turn pages','Identify parts'],
 ARRAY['Hold book right side up','Turn pages one at a time','Identify front and back cover'],
 true, NOW(), NOW()),

(md5('pp_lang_rhyme')::uuid,                md5('pp_lang_phonemic')::uuid,
 'Identify rhyming words', 'Learner identifies words that rhyme',
 ARRAY['Recite rhymes','Identify pairs','Create rhymes'],
 ARRAY['Recite simple rhymes','Identify rhyming pairs','Create simple rhymes'],
 true, NOW(), NOW()),

(md5('pp_math_sort_objects')::uuid,         md5('pp_math_sorting')::uuid,
 'Sort objects by color, size, and shape', 'Learner sorts objects based on different attributes',
 ARRAY['Sort by color','Sort by size','Sort by shape'],
 ARRAY['Group objects by color','Group objects by size','Group objects by shape'],
 true, NOW(), NOW()),

(md5('pp_math_rote_count')::uuid,           md5('pp_math_counting')::uuid,
 'Count forwards and backwards', 'Learner counts numbers in sequence',
 ARRAY['Count forwards','Count backwards','Match quantities'],
 ARRAY['Count forwards from 1 to 5 (PP1)','Count forwards from 1 to 20 (PP2)','Count backwards from 5 to 1','Match numbers with quantities'],
 true, NOW(), NOW()),

(md5('pp_math_compare_mass')::uuid,         md5('pp_math_mass')::uuid,
 'Compare heavy and light objects', 'Learner compares objects based on mass',
 ARRAY['Identify heavy','Identify light','Compare'],
 ARRAY['Lift objects of different mass','Identify heavy objects','Identify light objects','Compare two objects and determine which is heavier'],
 true, NOW(), NOW()),

(md5('lp_lit_read_words')::uuid,            md5('lp_lit_reading_fluency')::uuid,
 'Read simple words and sentences', 'Learner reads with increasing fluency',
 ARRAY['Read words','Read sentences','Read with pacing'],
 ARRAY['Read CVC words','Read simple sentences','Read with appropriate pacing'],
 true, NOW(), NOW()),

(md5('lp_math_count_100')::uuid,            md5('lp_math_numbers_1_100')::uuid,
 'Count and write numbers 1-100', 'Learner counts, reads and writes numbers',
 ARRAY['Count forwards','Count backwards','Write numbers','Place value'],
 ARRAY['Count forwards to 100','Count backwards from 50','Write numbers 1-100 correctly','Identify place value of tens and ones'],
 true, NOW(), NOW()),

(md5('lp_math_addition')::uuid,             md5('lp_math_numbers_1_100')::uuid,
 'Addition up to 50', 'Learner performs addition operations',
 ARRAY['Add numbers','Solve problems','Apply in context'],
 ARRAY['Add numbers without regrouping','Solve word problems involving addition','Use addition in real-life contexts'],
 true, NOW(), NOW()),

(md5('up_eng_sentence_types')::uuid,        md5('up_eng_grammar_sentences')::uuid,
 'Construct different types of sentences', 'Learner constructs declarative, interrogative, imperative and exclamatory sentences',
 ARRAY['Identify types','Construct sentences','Use punctuation'],
 ARRAY['Identify sentence types','Construct declarative sentences','Form questions correctly','Use correct punctuation'],
 true, NOW(), NOW()),

(md5('up_sci_plant_growth')::uuid,          md5('up_sci_plants')::uuid,
 'Investigate plant growth requirements', 'Learner investigates conditions necessary for plant growth',
 ARRAY['Identify requirements','Set up experiments','Record observations','Draw conclusions'],
 ARRAY['Identify plant growth requirements','Set up plant growth experiments','Record observations accurately','Draw conclusions from investigations'],
 true, NOW(), NOW()),

(md5('up_math_multiplication')::uuid,       md5('up_math_operations')::uuid,
 'Multiply and divide whole numbers', 'Learner performs multiplication and division operations',
 ARRAY['Multiply numbers','Divide numbers','Solve word problems'],
 ARRAY['Multiply up to 3-digit numbers','Divide up to 3-digit numbers by 1-digit numbers','Solve word problems involving multiplication','Apply operations in real-life situations'],
 true, NOW(), NOW()),

(md5('up_math_fraction_operations')::uuid,  md5('up_math_fractions_basic')::uuid,
 'Add and subtract fractions with like denominators', 'Learner performs operations with fractions',
 ARRAY['Identify fractions','Add fractions','Subtract fractions','Convert fractions'],
 ARRAY['Identify proper and improper fractions','Add fractions with like denominators','Subtract fractions with like denominators','Convert improper fractions to mixed numbers'],
 true, NOW(), NOW()),

(md5('up_ss_community_services')::uuid,     md5('up_ss_community_resources')::uuid,
 'Identify community services and resources', 'Learner identifies various resources and services in the community',
 ARRAY['Identify resources','Describe services','Explain importance','Use responsibly'],
 ARRAY['Identify community resources','Describe community services','Explain importance of community resources','Demonstrate responsible use of resources'],
 true, NOW(), NOW()),

(md5('js_eng_tenses_usage')::uuid,          md5('js_eng_grammar_tenses')::uuid,
 'Use appropriate tenses in communication', 'Learner uses correct verb tenses in various contexts',
 ARRAY['Identify tenses','Use present','Use past','Use future','Apply in writing'],
 ARRAY['Identify different verb tenses','Use present tenses correctly','Use past tenses appropriately','Use future tenses in communication','Apply tenses in writing'],
 true, NOW(), NOW()),

(md5('js_eng_comp_narrative')::uuid,        md5('js_eng_comp_essay')::uuid,
 'Write narrative compositions', 'Learner writes well-structured narrative essays',
 ARRAY['Develop plot','Use vocabulary','Organize ideas','Apply grammar','Be creative'],
 ARRAY['Develop plot and characters','Use appropriate vocabulary','Organize ideas logically','Apply correct grammar and punctuation','Write with creativity and originality'],
 true, NOW(), NOW()),

(md5('js_math_integer_ops')::uuid,          md5('js_math_integers')::uuid,
 'Perform operations with integers', 'Learner performs addition, subtraction, multiplication and division of integers',
 ARRAY['Add integers','Subtract integers','Multiply integers','Divide integers','Apply in context'],
 ARRAY['Add integers correctly','Subtract integers correctly','Multiply integers correctly','Divide integers correctly','Apply integer operations in real-life contexts'],
 true, NOW(), NOW()),

(md5('js_math_alg_simplify')::uuid,         md5('js_math_algebra_expressions')::uuid,
 'Simplify algebraic expressions', 'Learner simplifies and solves algebraic expressions',
 ARRAY['Identify terms','Collect like terms','Simplify','Solve equations'],
 ARRAY['Identify algebraic terms','Collect like terms','Simplify expressions correctly','Solve linear equations','Apply algebra in problem-solving'],
 true, NOW(), NOW()),

(md5('js_math_angle_relationships')::uuid,  md5('js_math_geo_angles')::uuid,
 'Identify and calculate angle relationships', 'Learner identifies different types of angles and their relationships',
 ARRAY['Identify angles','Calculate complementary','Calculate supplementary','Apply properties'],
 ARRAY['Identify acute, obtuse and right angles','Calculate complementary angles','Calculate supplementary angles','Apply angle properties in geometric problems'],
 true, NOW(), NOW()),

(md5('js_sci_cell_structure')::uuid,        md5('js_sci_cells')::uuid,
 'Identify cell structures and functions', 'Learner identifies parts of plant and animal cells',
 ARRAY['Draw plant cells','Draw animal cells','State functions','Differentiate','Use microscope'],
 ARRAY['Draw and label plant cells','Draw and label animal cells','State functions of cell organelles','Differentiate plant and animal cells','Use microscope to observe cells'],
 true, NOW(), NOW()),

(md5('js_sci_state_properties')::uuid,      md5('js_sci_states')::uuid,
 'Investigate properties of states of matter', 'Learner investigates properties of solids, liquids and gases',
 ARRAY['Identify solids','Identify liquids','Identify gases','Demonstrate changes','Explain particle model'],
 ARRAY['Identify properties of solids','Identify properties of liquids','Identify properties of gases','Demonstrate changes of state','Explain the particle model of matter'],
 true, NOW(), NOW()),

(md5('js_sci_energy_transformations')::uuid, md5('js_sci_energy_forms')::uuid,
 'Demonstrate energy transformations', 'Learner identifies and demonstrates different forms of energy and their transformations',
 ARRAY['Identify energy forms','Explain transformation','Demonstrate conversion','Apply concepts'],
 ARRAY['Identify different forms of energy','Explain energy transformation','Demonstrate energy conversion','Apply energy concepts in daily life'],
 true, NOW(), NOW()),

(md5('js_health_meal_planning')::uuid,      md5('js_health_nutrition_balanced')::uuid,
 'Plan balanced meals', 'Learner plans balanced meals based on nutritional requirements',
 ARRAY['Identify nutrients','Classify foods','Plan meals','Explain importance','Make choices'],
 ARRAY['Identify food nutrients','Classify foods into food groups','Plan a balanced meal','Explain importance of balanced diet','Make healthy food choices'],
 true, NOW(), NOW()),

(md5('js_pretech_material_identification')::uuid, md5('js_pretech_materials_properties')::uuid,
 'Identify properties of common materials', 'Learner identifies and tests properties of different materials',
 ARRAY['Classify materials','Test strength','Test flexibility','Select materials'],
 ARRAY['Classify materials based on properties','Test material strength','Test material flexibility','Select appropriate materials for tasks'],
 true, NOW(), NOW()),

(md5('js_pretech_drawing_sketch')::uuid,    md5('js_pretech_drawing_basic')::uuid,
 'Create basic technical sketches', 'Learner creates basic technical drawings using drawing instruments',
 ARRAY['Use instruments','Draw lines','Draw shapes','Apply dimensioning','Create isometric'],
 ARRAY['Use drawing instruments correctly','Draw straight lines','Draw simple geometric shapes','Apply dimensioning techniques','Create isometric sketches'],
 true, NOW(), NOW()),

(md5('js_social_history_communities')::uuid, md5('js_social_history_kenya')::uuid,
 'Trace the origin of Kenyan communities', 'Learner traces the migration and settlement of various Kenyan communities',
 ARRAY['Identify communities','Trace migration','Explain settlement','Describe organization','Analyze activities'],
 ARRAY['Identify major Kenyan communities','Trace migration patterns','Explain settlement patterns','Describe social organization of communities','Analyze economic activities of communities'],
 true, NOW(), NOW()),

(md5('js_social_geography_map_reading')::uuid, md5('js_social_geography_map')::uuid,
 'Read and interpret maps', 'Learner reads and interprets different types of maps',
 ARRAY['Identify symbols','Use scales','Calculate distances','Use grid references','Interpret contours'],
 ARRAY['Identify map symbols','Use map scales','Calculate distances on maps','Locate features using grid references','Interpret map contours'],
 true, NOW(), NOW()),

(md5('js_business_needs_wants')::uuid,      md5('js_business_needs')::uuid,
 'Differentiate between needs and wants', 'Learner distinguishes between human needs and wants',
 ARRAY['Define needs/wants','Give examples','Explain scarcity','Make choices'],
 ARRAY['Define needs and wants','Give examples of needs','Give examples of wants','Explain scarcity','Make rational choices'],
 true, NOW(), NOW()),

(md5('js_business_entrepreneurial_skills')::uuid, md5('js_business_entrepreneurship')::uuid,
 'Develop entrepreneurial skills', 'Learner develops basic entrepreneurial skills',
 ARRAY['Identify opportunities','Generate ideas','Research market','Prepare plan'],
 ARRAY['Identify entrepreneurial opportunities','Generate business ideas','Conduct simple market research','Prepare a simple business plan'],
 true, NOW(), NOW()),

(md5('js_agriculture_cultivation')::uuid,   md5('js_agriculture_crops_growing')::uuid,
 'Practice crop cultivation', 'Learner practices basic crop cultivation techniques',
 ARRAY['Prepare land','Select seeds','Plant crops','Care for crops','Harvest'],
 ARRAY['Prepare land for planting','Select quality seeds','Plant crops correctly','Apply appropriate crop care practices','Harvest crops properly'],
 true, NOW(), NOW()),

(md5('js_lifeskills_self_esteem_build')::uuid, md5('js_lifeskills_self_esteem')::uuid,
 'Build and maintain self-esteem', 'Learner develops positive self-esteem',
 ARRAY['Identify strengths','Accept weaknesses','Express feelings','Show confidence'],
 ARRAY['Identify personal strengths','Accept personal weaknesses','Express feelings appropriately','Demonstrate self-confidence'],
 true, NOW(), NOW()),

(md5('js_lifeskills_communication_skills')::uuid, md5('js_lifeskills_communication')::uuid,
 'Demonstrate effective communication skills', 'Learner demonstrates effective verbal and non-verbal communication',
 ARRAY['Express ideas','Listen actively','Use body language','Adapt communication'],
 ARRAY['Express ideas clearly','Listen actively','Use appropriate body language','Adapt communication to different audiences'],
 true, NOW(), NOW()),

(md5('js_sports_ball_skills')::uuid,        md5('js_sports_games_ball')::uuid,
 'Demonstrate basic ball game skills', 'Learner demonstrates fundamental skills in various ball games',
 ARRAY['Throw','Catch','Kick','Apply rules','Play in team'],
 ARRAY['Demonstrate throwing techniques','Demonstrate catching skills','Demonstrate kicking skills','Apply game rules','Participate in team play'],
 true, NOW(), NOW()),

(md5('js_optional_computer_components')::uuid, md5('js_optional_computer_hardware')::uuid,
 'Identify computer hardware components', 'Learner identifies and describes computer hardware components',
 ARRAY['Identify input','Identify output','Identify storage','Explain functions','Handle properly'],
 ARRAY['Identify input devices','Identify output devices','Identify storage devices','Explain functions of system unit components','Handle computer hardware properly'],
 true, NOW(), NOW())

ON CONFLICT (id) DO NOTHING;


-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT
  (SELECT COUNT(*) FROM public.learning_areas  WHERE school_id IS NULL) AS learning_areas,
  (SELECT COUNT(*) FROM public.strands s
     JOIN public.learning_areas la ON la.id = s.learning_area_id
   WHERE la.school_id IS NULL)                                          AS strands,
  (SELECT COUNT(*) FROM public.sub_strands ss
     JOIN public.strands s ON s.id = ss.strand_id
     JOIN public.learning_areas la ON la.id = s.learning_area_id
   WHERE la.school_id IS NULL)                                          AS sub_strands,
  (SELECT COUNT(*) FROM public.competencies c
     JOIN public.sub_strands ss ON ss.id = c.sub_strand_id
     JOIN public.strands s ON s.id = ss.strand_id
     JOIN public.learning_areas la ON la.id = s.learning_area_id
   WHERE la.school_id IS NULL)                                          AS competencies;

