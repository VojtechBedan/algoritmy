(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Mobilní navigace
  const menuButton = $('.menu-toggle');
  const navigation = $('#site-nav');
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };
  menuButton.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    navigation.classList.toggle('is-open', opening);
  });
  $$('#site-nav a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  // Zvýraznění části stránky v navigaci
  const navLinks = $$('.site-nav a[href^="#"]');
  const sections = navLinks.map((link) => $(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    sections.forEach((section) => observer.observe(section));
  }

  // Záložky praktických příkladů
  const exampleTabs = $$('.example-tab');
  const activateExample = (tab, moveFocus = false) => {
    exampleTabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      $(`#panel-${item.dataset.example}`).hidden = !selected;
    });
    if (moveFocus) tab.focus();
  };
  exampleTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateExample(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % exampleTabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + exampleTabs.length) % exampleTabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = exampleTabs.length - 1;
      activateExample(exampleTabs[next], true);
    });
  });

  // Interaktivní příklady
  const numberFrom = (selector) => {
    const field = $(selector);
    return field.value.trim() === '' ? NaN : Number(field.value);
  };
  $('[data-calculate]').addEventListener('click', () => {
    const a = numberFrom('[data-sum-a]');
    const b = numberFrom('[data-sum-b]');
    const output = $('[data-sum-result]');
    if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(a + b)) {
      output.textContent = 'Zadej dvě platná čísla.';
      output.classList.add('error');
      return;
    }
    output.textContent = String(a + b);
    output.classList.remove('error');
  });
  $('[data-compare]').addEventListener('click', () => {
    const a = numberFrom('[data-compare-a]');
    const b = numberFrom('[data-compare-b]');
    const output = $('[data-compare-result]');
    if (!Number.isFinite(a) || !Number.isFinite(b)) output.textContent = 'Zadej dvě platná čísla.';
    else if (a > b) output.textContent = 'A je větší než B.';
    else if (a < b) output.textContent = 'A je menší než B.';
    else output.textContent = 'A a B jsou stejná.';
  });
  $('[data-divide]').addEventListener('click', () => {
    const numerator = numberFrom('[data-dividend]');
    const denominator = numberFrom('[data-divisor]');
    const output = $('[data-divide-result]');
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) output.textContent = 'Zadej dvě platná čísla.';
    else if (denominator === 0) output.textContent = 'Nulou dělit nelze. Výpočet neproběhl.';
    else output.textContent = `Výsledek: ${numerator / denominator}`;
  });

  // Závěrečný test: otázky a odpovědi vycházejí ze zdrojového algo1.md.
  // Doplňující otázka o logických operacích odpovídá zadání projektu.
  const questions = [
    { type: 'choice', prompt: 'Které tvrzení nejlépe popisuje konečnost algoritmu?', answers: ['Po konečném počtu kroků dojde od začátku do konce.', 'Vždy používá matematický vzorec.', 'Řeší pouze jeden konkrétní případ.', 'Je zapsaný jen programovacím jazykem.'], correct: 0, explanation: 'Konečný algoritmus po omezeném počtu kroků skončí.' },
    { type: 'choice', prompt: 'Jak se projeví porušení věcné správnosti?', answers: ['Překladač vždy ohlásí syntaktickou chybu.', 'Program může zdánlivě pracovat, ale vrací chybné výsledky.', 'Program se vždy okamžitě zastaví.', 'Změní se pouze názvy proměnných.'], correct: 1, explanation: 'Podle zdroje může výpočet proběhnout, ale se špatným vzorcem nebo postupem.' },
    { type: 'choice', prompt: 'Jak správně zapíšeme zlomek (A + B) / (C + D)?', answers: ['X := A+B / C+D', 'X := (A+B) / (C+D)', 'X := A+B / (C+D)', 'X := (A+B) / C+D'], correct: 1, explanation: 'Závorky zachovají čitatele i jmenovatele zlomku.' },
    { type: 'choice', prompt: 'Jaká značka ve vývojovém diagramu slouží k načtení vstupu „Čti: A“?', answers: ['Obdélník', 'Kosočtverec', 'Kosodélník', 'Ovál'], correct: 2, explanation: 'Vstup i výstup se zapisuje do kosodélníku.' },
    { type: 'choice', prompt: 'Která vlastnost zajišťuje stejný výsledek při stejných vstupech?', answers: ['Obecnost', 'Srozumitelnost', 'Opakovatelnost', 'Konečnost'], correct: 2, explanation: 'Opakovatelnost (determinismus) znamená stejné výsledky pro stejné vstupy.' },
    { type: 'text', prompt: 'Vyjmenuj všech šest vlastností správného algoritmu.', placeholder: 'Např. konečnost, věcná správnost…', check: (value) => {
      const names = ['konecnost', 'vecna spravnost', 'jednoznacnost', 'obecnost', 'opakovatelnost', 'srozumitelnost'];
      return names.every((name) => value.includes(name));
    }, expected: 'Konečnost, věcná správnost, jednoznačnost, obecnost, opakovatelnost a srozumitelnost.', explanation: 'Všechny tyto vlastnosti jsou uvedeny v části o správném algoritmu.' },
    { type: 'text', prompt: 'Uveď dvě podmínky řešitelnosti, které je třeba ošetřit u dělení a odmocniny.', placeholder: 'Co musí platit pro jmenovatel a výraz pod odmocninou?', check: (value) => {
      const division = value.includes('nul') && (value.includes('jmenovatel') || value.includes('del') || value.includes('dělen'));
      const root = (value.includes('odmocnin') || value.includes('odmoc')) && (value.includes('zaporn') || value.includes('nezaporn') || value.includes('kladn'));
      return division && root;
    }, expected: 'Jmenovatel nesmí být nula a výraz pod odmocninou nesmí být záporný (v oboru reálných čísel).', explanation: 'Obě podmínky musí být ošetřené před samotným výpočtem.' },
    { type: 'text', prompt: 'Jak se liší AND a OR? Popiš, kdy výsledek každé operace bude pravda.', placeholder: 'AND je pravda, když… OR je pravda, když…', check: (value) => {
      const and = value.includes('and') && (value.includes('obě') || value.includes('obe') || value.includes('všechny') || value.includes('vsechny') || value.includes('současně') || value.includes('soucasne'));
      const or = value.includes('or') && (value.includes('alespoň jedna') || value.includes('alespon jedna') || value.includes('jedna z') || value.includes('aspoň jedna') || value.includes('aspon jedna'));
      return and && or;
    }, expected: 'AND je pravda, když jsou pravdivé obě podmínky. OR je pravda, když je pravdivá alespoň jedna (nebo obě).', explanation: 'AND je logický součin, OR logický součet; jejich úplné kombinace ukazuje pravdivostní tabulka.' },
    { type: 'text', prompt: 'K čemu slouží spojka ve vývojovém diagramu a jak se označuje?', placeholder: 'Popiš její účel i pravidlo pro její číslo.', check: (value) => {
      const purpose = value.includes('spoj') && (value.includes('část') || value.includes('cast') || value.includes('přerušen') || value.includes('prerusen') || value.includes('propo') || value.includes('navaz'));
      const number = value.includes('stejn') && (value.includes('čísl') || value.includes('cisl'));
      return purpose && number;
    }, expected: 'Spojuje přerušené části diagramu a odpovídající spojky mají stejné číslo.', explanation: 'Stejné číslo ukazuje, kde diagram po přerušení pokračuje.' },
    { type: 'choice', prompt: 'Co dělá překladač s programem napsaným v programovacím jazyce?', answers: ['Převádí ho do strojového kódu.', 'Ověřuje, zda jsou všechny vzorce matematicky správně.', 'Vytvoří z něj vývojový diagram.', 'Přepíše komentáře do češtiny.'], correct: 0, explanation: 'Překladač převádí program do strojového kódu.' }
  ];

  const quiz = $('[data-quiz]');
  const form = $('[data-quiz-form]', quiz);
  const questionText = $('[data-question]', quiz);
  const answersNode = $('[data-answers]', quiz);
  const feedback = $('[data-feedback]', quiz);
  const nextButton = $('[data-next]', quiz);
  const progressLabel = $('[data-progress-label]', quiz);
  const progressPercent = $('[data-progress-percent]', quiz);
  const progressBar = $('[data-progress-bar]', quiz);
  const progressTrack = $('.progress-track', quiz);
  const resultNode = $('[data-result]', quiz);
  let current = 0;
  let submitted = false;
  const responses = [];

  const normalize = (value) => value.toLocaleLowerCase('cs-CZ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  function renderQuestion() {
    const item = questions[current];
    submitted = false;
    questionText.textContent = item.prompt;
    answersNode.replaceChildren();
    feedback.textContent = '';
    feedback.className = 'question-feedback';
    nextButton.disabled = false;
    nextButton.innerHTML = current === questions.length - 1 ? 'Zobrazit výsledek <span aria-hidden="true">→</span>' : 'Další otázka <span aria-hidden="true">→</span>';
    const percentage = Math.round(((current + 1) / questions.length) * 100);
    progressLabel.textContent = `OTÁZKA ${String(current + 1).padStart(2, '0')} / ${questions.length}`;
    progressPercent.textContent = `${percentage} %`;
    progressBar.style.width = `${percentage}%`;
    progressTrack.setAttribute('aria-valuenow', String(current + 1));

    if (item.type === 'choice') {
      const groupName = `answer-${current}`;
      item.answers.forEach((answer, index) => {
        const label = document.createElement('label');
        label.className = 'answer-option';
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = groupName;
        radio.value = String(index);
        radio.setAttribute('aria-label', `${String.fromCharCode(65 + index)}: ${answer}`);
        const letter = document.createElement('span');
        letter.className = 'answer-letter';
        letter.textContent = String.fromCharCode(65 + index);
        const text = document.createElement('span');
        text.textContent = answer;
        label.append(radio, letter, text);
        answersNode.append(label);
      });
    } else {
      const input = document.createElement('input');
      input.className = 'short-answer';
      input.type = 'text';
      input.name = `answer-${current}`;
      input.autocomplete = 'off';
      input.placeholder = item.placeholder;
      input.setAttribute('aria-label', item.prompt);
      answersNode.append(input);
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (submitted) {
      current += 1;
      if (current >= questions.length) showResults();
      else renderQuestion();
      return;
    }
    const item = questions[current];
    let rawAnswer = '';
    let correct = false;
    if (item.type === 'choice') {
      const selected = $('input[type="radio"]:checked', answersNode);
      if (!selected) {
        feedback.textContent = 'Nejdřív vyber jednu odpověď.';
        return;
      }
      rawAnswer = item.answers[Number(selected.value)];
      correct = Number(selected.value) === item.correct;
    } else {
      const input = $('input[type="text"]', answersNode);
      rawAnswer = input.value.trim();
      if (!rawAnswer) {
        feedback.textContent = 'Napiš krátkou odpověď.';
        input.focus();
        return;
      }
      correct = item.check(normalize(rawAnswer));
    }
    responses[current] = { rawAnswer, correct };
    submitted = true;
    feedback.classList.add(correct ? 'correct' : '');
    feedback.textContent = correct ? '✓ Správně. ' + item.explanation : 'Ještě ne. ' + item.explanation;
    nextButton.innerHTML = current === questions.length - 1 ? 'Zobrazit výsledek <span aria-hidden="true">→</span>' : 'Pokračovat <span aria-hidden="true">→</span>';
  });

  function showResults() {
    form.hidden = true;
    const score = responses.filter((response) => response?.correct).length;
    const percent = Math.round((score / questions.length) * 100);
    const heading = percent === 100 ? 'Perfektní práce!' : percent >= 70 ? 'Máš dobrý přehled.' : 'Každý pokus tě posune.';
    const summary = document.createElement('div');
    summary.innerHTML = `<span class="result-score">${score} / ${questions.length}</span><span class="result-percent">${percent} % ÚSPĚŠNOST</span><h3>${heading}</h3><p>Prošel/a jsi všechna témata. Tady jsou odpovědi a vysvětlení:</p>`;
    const review = document.createElement('div');
    review.className = 'result-review';
    questions.forEach((item, index) => {
      const response = responses[index];
      const block = document.createElement('article');
      block.className = 'review-item';
      const title = document.createElement('h4');
      title.textContent = `${index + 1}. ${item.prompt}`;
      const given = document.createElement('p');
      given.className = response.correct ? 'review-answer' : 'review-wrong';
      given.textContent = `Tvoje odpověď: ${response.rawAnswer}`;
      const explanation = document.createElement('p');
      explanation.textContent = item.type === 'choice' ? `Správná odpověď: ${item.answers[item.correct]}. ${item.explanation}` : `Vzorová odpověď: ${item.expected} ${item.explanation}`;
      block.append(title, given, explanation);
      review.append(block);
    });
    const actions = document.createElement('div');
    actions.className = 'result-actions';
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'button button-primary';
    retry.innerHTML = 'Zkusit znovu <span aria-hidden="true">↻</span>';
    retry.addEventListener('click', () => {
      current = 0;
      responses.length = 0;
      form.hidden = false;
      resultNode.hidden = true;
      renderQuestion();
      questionText.focus?.();
    });
    actions.append(retry);
    resultNode.replaceChildren(summary, review, actions);
    resultNode.hidden = false;
    progressLabel.textContent = 'TEST DOKONČEN';
    progressPercent.textContent = `${percent} %`;
    progressBar.style.width = '100%';
    progressTrack.setAttribute('aria-valuenow', String(questions.length));
    resultNode.querySelector('.button').focus();
  }

  renderQuestion();
  $('[data-year]').textContent = String(new Date().getFullYear());
})();
