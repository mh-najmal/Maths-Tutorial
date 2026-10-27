// =========================================================================
// TAILWIND CONFIGURATION
// =========================================================================
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#FFE600',       // Electric learning yellow from logo
          'yellow-dark': '#E5CF00',
          'yellow-light': '#FFF9C2',
          cream: '#FAF6EE',        // Warm luxury paper cream
          'cream-light': '#FFFDF9',
          'cream-border': '#E8DFC9',
          ink: '#111317',          // Deep black ink
          'ink-muted': '#565E6C',
          orange: '#FF5416',       // Hot orange accent
          'orange-hover': '#E04206',
          chalkboard: '#15241C',   // Chalkboard deep forest green
          'chalkboard-card': '#1E3429',
          chalk: '#EAF8ED',
        }
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        hand: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px #111317',
        'brutal-lg': '6px 6px 0px #111317',
        'brutal-xl': '8px 8px 0px #111317',
        'brutal-hover': '2px 2px 0px #111317',
        'brutal-orange': '4px 4px 0px #FF5416',
        'chalk': '0 8px 30px rgba(0, 0, 0, 0.25)',
      }
    }
  }
}

// =========================================================================
// APPLICATION LOGIC
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  
  // Update copyright year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  // -----------------------------------------------------------------------
  // 2. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // -----------------------------------------------------------------------
  const revealItems = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.02,
      rootMargin: '0px 0px 80px 0px'
    });

    revealItems.forEach(item => {
      revealObserver.observe(item);
      // Eagerly reveal items already visible or near top of page
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight + 80) {
        item.classList.add('revealed');
      }
    });
  } else {
    revealItems.forEach(item => item.classList.add('revealed'));
  }

  // -----------------------------------------------------------------------
  // 3. STATS ANIMATED NUMBER COUNTERS
  // -----------------------------------------------------------------------
  const counters = document.querySelectorAll('.counter');
  let countersStarted = false;

  const runCounters = () => {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const duration = 1800; // 1.8s
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        counter.textContent = currentVal.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const statsSection = document.getElementById('stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        runCounters();
        observer.unobserve(statsSection);
      }
    }, { threshold: 0.25 });
    statsObserver.observe(statsSection);
  } else {
    runCounters();
  }

  // -----------------------------------------------------------------------
  // 4. SYLLABUS CATEGORY TABS
  // -----------------------------------------------------------------------
  const syllabusTabs = document.querySelectorAll('.syllabus-tab');
  const syllabusCards = document.querySelectorAll('.syllabus-card');

  syllabusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      syllabusTabs.forEach(t => {
        t.classList.remove('bg-brand-yellow', 'text-brand-ink');
        t.classList.add('bg-white', 'text-brand-ink');
      });
      tab.classList.remove('bg-white');
      tab.classList.add('bg-brand-yellow', 'text-brand-ink');

      const category = tab.getAttribute('data-category');
      syllabusCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // -----------------------------------------------------------------------
  // 5. "TRY A TRICK" (Multiply by 11 Interactive Widget)
  // -----------------------------------------------------------------------
  const trickInput = document.getElementById('trickInput');
  const calculateTrickBtn = document.getElementById('calculateTrickBtn');
  const presetBtns = document.querySelectorAll('.preset-btn');

  const step1DigitA = document.getElementById('step1DigitA');
  const step1DigitB = document.getElementById('step1DigitB');
  const step1Note = document.getElementById('step1Note');

  const step2DigitA = document.getElementById('step2DigitA');
  const step2DigitB = document.getElementById('step2DigitB');
  const step2Sum = document.getElementById('step2Sum');
  const step2Note = document.getElementById('step2Note');

  const finalDigitA = document.getElementById('finalDigitA');
  const finalDigitMiddle = document.getElementById('finalDigitMiddle');
  const finalDigitB = document.getElementById('finalDigitB');
  const finalVerificationNote = document.getElementById('finalVerificationNote');

  const carryOverBox = document.getElementById('carryOverBox');
  const carryOverExplanation = document.getElementById('carryOverExplanation');

  function updateMultiplyBy11Trick(num) {
    let n = parseInt(num, 10);
    if (isNaN(n) || n < 10) n = 10;
    if (n > 99) n = 99;

    trickInput.value = n;

    const tens = Math.floor(n / 10);
    const units = n % 10;
    const sum = tens + units;
    const hasCarry = sum >= 10;

    // Step 1
    step1DigitA.textContent = tens;
    step1DigitB.textContent = units;
    step1Note.textContent = `Left digit is ${tens}, right digit is ${units}. Leave space in center!`;

    // Step 2
    step2DigitA.textContent = tens;
    step2DigitB.textContent = units;
    step2Sum.textContent = sum;
    step2Note.textContent = `${tens} + ${units} = ${sum}`;

    // Step 3 (Calculation)
    const total = n * 11;
    if (hasCarry) {
      const newTens = tens + Math.floor(sum / 10);
      const remainderUnits = sum % 10;

      finalDigitA.textContent = newTens;
      finalDigitMiddle.textContent = remainderUnits;
      finalDigitB.textContent = units;

      carryOverBox.classList.remove('hidden');
      carryOverExplanation.textContent = `Since ${tens} + ${units} = ${sum} (≥ 10), we keep the ${remainderUnits} in the middle and carry +1 to ${tens}, making it ${newTens}. Total = ${total}!`;
    } else {
      finalDigitA.textContent = tens;
      finalDigitMiddle.textContent = sum;
      finalDigitB.textContent = units;

      carryOverBox.classList.add('hidden');
    }

    finalVerificationNote.textContent = `${n} × 11 = ${total}! (Try checking with a calculator!)`;
  }

  if (calculateTrickBtn) {
    calculateTrickBtn.addEventListener('click', () => {
      updateMultiplyBy11Trick(trickInput.value);
    });
  }

  if (trickInput) {
    trickInput.addEventListener('input', () => {
      if (trickInput.value.length >= 2) {
        updateMultiplyBy11Trick(trickInput.value);
      }
    });
    trickInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        updateMultiplyBy11Trick(trickInput.value);
      }
    });
  }

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const num = btn.getAttribute('data-num');
      updateMultiplyBy11Trick(num);
    });
  });

  // Initialize with 43
  updateMultiplyBy11Trick(43);

  // -----------------------------------------------------------------------
  // 6. SAMPLE VIDEO PREVIEW MODAL
  // -----------------------------------------------------------------------
  const videoCards = document.querySelectorAll('.video-card-trigger');
  const videoModal = document.getElementById('videoModal');
  const closeVideoModalBtn = document.getElementById('closeVideoModalBtn');
  const modalVideoTitle = document.getElementById('modalVideoTitle');
  const modalVideoDesc = document.getElementById('modalVideoDesc');
  const modalVideoDuration = document.getElementById('modalVideoDuration');
  const modalBookDemoBtn = document.getElementById('modalBookDemoBtn');

  videoCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title');
      const desc = card.getAttribute('data-desc');
      const dur = card.getAttribute('data-duration');

      modalVideoTitle.textContent = title;
      modalVideoDesc.textContent = desc;
      modalVideoDuration.textContent = dur;

      videoModal.classList.remove('hidden');
    });
  });

  if (closeVideoModalBtn && videoModal) {
    closeVideoModalBtn.addEventListener('click', () => {
      videoModal.classList.add('hidden');
    });

    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        videoModal.classList.add('hidden');
      }
    });

    if (modalBookDemoBtn) {
      modalBookDemoBtn.addEventListener('click', () => {
        videoModal.classList.add('hidden');
      });
    }
  }

  // -----------------------------------------------------------------------
  // 7. MATHEMATICAL QUIZ CHALLENGE (5 Questions with delayed reveals)
  // -----------------------------------------------------------------------
  const quizQuestions = [
    {
      id: 1,
      difficulty: "Classic Sneaky Trap",
      question: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
      hint: "Warning: Your subconscious will scream $0.10, but check the algebra!",
      options: [
        { text: "$0.10 (Ten cents)", isCorrect: false },
        { text: "$0.05 (Five cents)", isCorrect: true },
        { text: "$0.01 (One cent)", isCorrect: false },
        { text: "$1.00 (One dollar)", isCorrect: false }
      ],
      explanation: "If the ball were $0.10 and the bat costs $1.00 more, the bat would cost $1.10, making the total $1.20! Let Ball = x. Bat = x + $1.00. Total: x + (x + 1.00) = 1.10 → 2x = 0.10 → Ball x = $0.05!"
    },
    {
      id: 2,
      difficulty: "Rate & Work Fallacy",
      question: "If it takes 5 machines 5 minutes to make 5 math pencils, how long would it take 100 machines to make 100 math pencils?",
      hint: "Does more workers mean more time, or does each worker produce at a fixed rate?",
      options: [
        { text: "100 minutes", isCorrect: false },
        { text: "5 minutes", isCorrect: true },
        { text: "20 minutes", isCorrect: false },
        { text: "1 minute", isCorrect: false }
      ],
      explanation: "Each individual machine takes 5 minutes to complete 1 pencil. Therefore, 100 machines working simultaneously produce 100 pencils in exactly 5 minutes!"
    },
    {
      id: 3,
      difficulty: "Linguistic Logic Trick",
      question: "A farmer has 17 sheep in a pasture. A sudden storm hits, and all but 9 run away. How many sheep does the farmer have left?",
      hint: "Read the phrase 'all but nine' with utmost precision!",
      options: [
        { text: "8 sheep (17 - 9 = 8)", isCorrect: false },
        { text: "9 sheep", isCorrect: true },
        { text: "0 sheep", isCorrect: false },
        { text: "17 sheep", isCorrect: false }
      ],
      explanation: "'All BUT 9 ran away' literally means that exactly 9 sheep remained! 8 sheep ran away, leaving 9 safe with the farmer."
    },
    {
      id: 4,
      difficulty: "Exponential Doubling Trap",
      question: "In a lake, there is a patch of lily pads. Every day, the patch doubles in size. If it takes 48 days for the patch to cover the entire lake, how long would it take to cover half of the lake?",
      hint: "Think backward from day 48!",
      options: [
        { text: "24 days (Half of 48)", isCorrect: false },
        { text: "47 days", isCorrect: true },
        { text: "12 days", isCorrect: false },
        { text: "36 days", isCorrect: false }
      ],
      explanation: "Since the patch doubles every single day, if the lake is full on Day 48, it was half full on Day 47! Linear intuition fails against exponential growth."
    },
    {
      id: 5,
      difficulty: "Possession Riddle",
      question: "You have 3 apples on your desk and you take away 2 apples. How many apples do YOU have now?",
      hint: "Focus on who 'you' are and what action you just performed!",
      options: [
        { text: "1 apple (3 - 2 = 1)", isCorrect: false },
        { text: "2 apples (The ones you took!)", isCorrect: true },
        { text: "3 apples", isCorrect: false },
        { text: "Zero apples", isCorrect: false }
      ],
      explanation: "You took away 2 apples, so YOU have 2 apples! There is 1 apple remaining on the desk, but that's not what the question asked."
    }
  ];

  let currentQuizIndex = 0;
  let userSelectedOptions = [];
  let quizScore = 0;

  const quizProgressBadge = document.getElementById('quizProgressBadge');
  const quizDifficultyBadge = document.getElementById('quizDifficultyBadge');
  const quizQuestionText = document.getElementById('quizQuestionText');
  const quizHintText = document.getElementById('quizHintText');
  const quizOptionsContainer = document.getElementById('quizOptionsContainer');
  const quizNextBtn = document.getElementById('quizNextBtn');
  const quizStage = document.getElementById('quizStage');
  const quizResultsStage = document.getElementById('quizResultsStage');
  const quizFinalScore = document.getElementById('quizFinalScore');
  const quizPersonalityFeedback = document.getElementById('quizPersonalityFeedback');
  const quizExplanationsList = document.getElementById('quizExplanationsList');
  const quizRestartBtn = document.getElementById('quizRestartBtn');
  const quizShareWhatsAppBtn = document.getElementById('quizShareWhatsAppBtn');
  const quizProgressTicks = document.querySelectorAll('#quizProgressTicks span');

  function loadQuizQuestion(index) {
    const q = quizQuestions[index];
    quizProgressBadge.textContent = `QUESTION ${index + 1} OF 5`;
    quizDifficultyBadge.textContent = `Level: ${q.difficulty}`;
    quizQuestionText.textContent = q.question;
    quizHintText.textContent = q.hint;

    // Update progress ticks
    quizProgressTicks.forEach((tick, i) => {
      if (i === index) {
        tick.className = 'w-3 h-3 rounded-full bg-brand-yellow border-2 border-brand-ink';
      } else if (i < index) {
        tick.className = 'w-3 h-3 rounded-full bg-brand-ink border border-brand-ink';
      } else {
        tick.className = 'w-3 h-3 rounded-full bg-brand-cream-border border border-brand-ink';
      }
    });

    // Reset Next button
    quizNextBtn.disabled = true;
    quizNextBtn.className = 'font-display font-bold text-sm px-6 py-2.5 rounded-xl border-2 border-brand-ink bg-gray-200 text-gray-500 cursor-not-allowed transition-all shadow-brutal';
    quizNextBtn.textContent = index === 4 ? 'See Final Score & Explanations 🏆' : 'Next Question →';

    // Render options without revealing answer
    quizOptionsContainer.innerHTML = '';
    q.options.forEach((opt, optIndex) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn text-left p-3 min-[400px]:p-3.5 sm:p-4 rounded-xl border-2 border-brand-ink bg-brand-cream-light hover:bg-brand-yellow font-mono text-xs sm:text-sm font-semibold transition-all shadow-brutal flex items-center justify-between gap-2.5 group break-words cursor-pointer';
      btn.innerHTML = `
        <span class="break-words leading-snug">${opt.text}</span>
        <span class="w-5 h-5 rounded-full border-2 border-brand-ink flex items-center justify-center text-xs group-hover:bg-brand-ink group-hover:text-white flex-shrink-0">&bull;</span>
      `;

      btn.addEventListener('click', () => {
        // Deselect others
        document.querySelectorAll('.quiz-option-btn').forEach(b => {
          b.classList.remove('bg-brand-yellow', 'ring-2', 'ring-brand-ink');
          b.classList.add('bg-brand-cream-light');
        });

        // Select this option
        btn.classList.remove('bg-brand-cream-light');
        btn.classList.add('bg-brand-yellow', 'ring-2', 'ring-brand-ink');

        // Save user selection
        userSelectedOptions[index] = optIndex;

        // Enable Next button
        quizNextBtn.disabled = false;
        quizNextBtn.className = 'font-display font-bold text-sm px-6 py-2.5 rounded-xl border-2 border-brand-ink bg-brand-yellow hover:bg-brand-orange hover:text-white text-brand-ink cursor-pointer transition-all shadow-brutal';
      });

      quizOptionsContainer.appendChild(btn);
    });
  }

  function showQuizResults() {
    quizStage.classList.add('hidden');
    quizResultsStage.classList.remove('hidden');

    // Calculate score
    quizScore = 0;
    quizExplanationsList.innerHTML = '';

    quizQuestions.forEach((q, i) => {
      const selectedIndex = userSelectedOptions[i];
      const isUserCorrect = q.options[selectedIndex]?.isCorrect || false;
      if (isUserCorrect) quizScore++;

      // Build explanation card
      const itemDiv = document.createElement('div');
      itemDiv.className = `p-4 rounded-xl border-2 ${isUserCorrect ? 'border-green-500 bg-green-50/60' : 'border-red-400 bg-red-50/60'}`;
      itemDiv.innerHTML = `
        <div class="flex items-center justify-between mb-1.5">
          <span class="font-bold text-xs uppercase ${isUserCorrect ? 'text-green-700' : 'text-red-700'}">
            ${isUserCorrect ? '✓ You got it Right!' : '✗ You Fell in the Trap!'}
          </span>
          <span class="font-mono text-xs text-brand-ink-muted">Q${i + 1}</span>
        </div>
        <p class="font-bold text-brand-ink text-sm mb-1">${q.question}</p>
        <p class="text-xs text-brand-ink-muted mb-2">
          Your answer: <span class="font-bold text-brand-ink">${q.options[selectedIndex]?.text || 'Skipped'}</span>
        </p>
        <p class="text-xs ${isUserCorrect ? 'text-green-900' : 'text-brand-ink'} bg-white/80 p-2.5 rounded-lg border border-black/10">
          💡 <strong>Why:</strong> ${q.explanation}
        </p>
      `;
      quizExplanationsList.appendChild(itemDiv);
    });

    quizFinalScore.textContent = quizScore;

    // Personality rank
    let rank = '';
    if (quizScore === 5) {
      rank = '👑 "Archimedes Reborn! Flawless 5/5!"';
    } else if (quizScore >= 3) {
      rank = '🧠 "Sharp Mind! You dodged the biggest math traps!"';
    } else {
      rank = '⚡ "The Classic Math Victim! But you will never fall for these again!"';
    }
    quizPersonalityFeedback.textContent = rank;

    // WhatsApp Share link
    const shareMsg = encodeURIComponent(`I just took the Maths Tutorial 5-Question Brain Teaser and scored ${quizScore}/5! Can you beat my score? Check it out at Maths Tutorial (+91 89434 37235).`);
    quizShareWhatsAppBtn.href = `https://wa.me/?text=${shareMsg}`;
  }

  if (quizNextBtn) {
    quizNextBtn.addEventListener('click', () => {
      if (currentQuizIndex < 4) {
        currentQuizIndex++;
        loadQuizQuestion(currentQuizIndex);
      } else {
        showQuizResults();
      }
    });
  }

  if (quizRestartBtn) {
    quizRestartBtn.addEventListener('click', () => {
      currentQuizIndex = 0;
      userSelectedOptions = [];
      quizScore = 0;
      quizResultsStage.classList.add('hidden');
      quizStage.classList.remove('hidden');
      loadQuizQuestion(0);
    });
  }

  // Initialize Quiz on first question
  loadQuizQuestion(0);

  // -----------------------------------------------------------------------
  // 8. FAQ ACCORDION INTERACTION
  // -----------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherContent = otherItem.querySelector('.faq-content');
          const otherIcon = otherItem.querySelector('.faq-icon');
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherContent.classList.add('hidden');
          otherIcon.textContent = '+';
          otherIcon.classList.remove('rotate-45', 'bg-brand-orange', 'text-white');
          otherIcon.classList.add('bg-brand-yellow', 'text-brand-ink');
        }
      });

      // Toggle current
      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        content.classList.add('hidden');
        icon.textContent = '+';
        icon.classList.remove('rotate-45', 'bg-brand-orange', 'text-white');
        icon.classList.add('bg-brand-yellow', 'text-brand-ink');
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        content.classList.remove('hidden');
        icon.textContent = '✕';
        icon.classList.add('rotate-45', 'bg-brand-orange', 'text-white');
        icon.classList.remove('bg-brand-yellow', 'text-brand-ink');
      }
    });
  });

  // -----------------------------------------------------------------------
  // 9. WHATSAPP MESSAGE BUILDER (Dynamic Live Generator)
  // -----------------------------------------------------------------------
  const waName = document.getElementById('waName');
  const waGrade = document.getElementById('waGrade');
  const waSyllabus = document.getElementById('waSyllabus');
  const waGoal = document.getElementById('waGoal');
  const waCustomNote = document.getElementById('waCustomNote');
  const waPreviewText = document.getElementById('waPreviewText');
  const whatsappForm = document.getElementById('whatsappForm');

  function generateWhatsAppMessage() {
    const name = waName.value.trim() || 'Parent/Student';
    const grade = waGrade.value;
    const syllabus = waSyllabus.value;
    const goal = waGoal.value;
    const note = waCustomNote.value.trim();

    let msg = `Hi Maths Tutorial! My name is ${name}. I am inquiring about online classes for ${grade} (${syllabus} syllabus). My primary goal is: ${goal}.`;
    if (note) {
      msg += ` Additional Note: ${note}`;
    }
    msg += ` Please let me know your available slots for a free demo session!`;

    waPreviewText.textContent = `"${msg}"`;
    return msg;
  }

  [waName, waGrade, waSyllabus, waGoal, waCustomNote].forEach(el => {
    if (el) {
      el.addEventListener('input', generateWhatsAppMessage);
      el.addEventListener('change', generateWhatsAppMessage);
    }
  });

  if (whatsappForm) {
    whatsappForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = generateWhatsAppMessage();
      const targetPhone = "918943437235";
      const encodedUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
      window.open(encodedUrl, '_blank');
    });
  }

});