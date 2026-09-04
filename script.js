(function(){
  "use strict";

  /* ---------- mobile nav toggle ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function(){
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
    });
  });

  /* ---------- icon set (monoline, shared stroke style) ---------- */
  var ICON = {
    creative: '<path d="M4 20l3-1 10.2-10.2-2-2L5 17l-1 3z"/><path d="M13.8 5.2l2 2"/>',
    technical: '<path d="M15.6 3.6a3.8 3.8 0 0 0-5 4.9L4.5 14.6v3.9h3.9l6.1-6.1a3.8 3.8 0 0 0 4.9-5l-2.6 2.5-2-2 2.6-2.6z"/>',
    events: '<rect x="4" y="5.5" width="16" height="14" rx="1.5"/><path d="M4 9.5h16M8 3.5v4M16 3.5v4"/>',
    discipline: '<path d="M12 3.2l7 2.8v6c0 4.4-3 7.5-7 8.8-4-1.3-7-4.4-7-8.8V6l7-2.8z"/>',
    promotion: '<path d="M3 10v4h3l6 4V6l-6 4H3z"/><path d="M14.5 9a4.2 4.2 0 0 1 0 6"/>',
    robot: '<rect x="6" y="8" width="12" height="9" rx="2"/><circle cx="9.5" cy="12.5" r="1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="12.5" r="1" fill="currentColor" stroke="none"/><path d="M12 8V5M9.5 5h5"/><path d="M4 12H2M22 12h-2"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.4M12 18.6V21M4.9 6l1.7 1.5M17.4 16.5l1.7 1.5M4.9 18l1.7-1.5M17.4 7.5l1.7-1.5M3 12h2.4M18.6 12H21"/>',
    trophy: '<path d="M8.2 4h7.6v3.8a3.8 3.8 0 0 1-7.6 0V4z"/><path d="M8.2 5H5.3a3 3 0 0 0 2.9 3.8M15.8 5h2.9a3 3 0 0 1-2.9 3.8"/><path d="M12 11.8v3M9 20h6M10 17.8h4v2.2h-4z"/>',
    screen: '<rect x="3" y="4.5" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16.5V20"/>',
    bulb: '<path d="M9.5 18h5M10.3 21h3.4"/><path d="M12 3.2a6 6 0 0 0-3.4 10.9c.5.4.8 1 .8 1.6h5.2c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3.2z"/>',
    nodes: '<circle cx="6" cy="6.5" r="2.1"/><circle cx="18" cy="6.5" r="2.1"/><circle cx="12" cy="18" r="2.1"/><path d="M7.6 7.8L10.5 16M16.4 7.8L13.5 16M8.1 6.5h7.8"/>'
  };
  function svgIcon(key){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+ICON[key]+'</svg>';
  }

  /* ---------- teams data + render ---------- */
  var teams = [
    { id:'creative', icon:'creative', name:'Creative Team', tagline:'Design, branding &amp; content', heads:['Agamjot Singh'] },
    { id:'technical', icon:'technical', name:'Technical Team', tagline:'Builds the bots', heads:['Prince Kumar Anand','Shivam Prashar'] },
    { id:'events', icon:'events', name:'Event Management', tagline:'Runs the show', heads:['Shiv Kumar','Kabir Verma'] },
    { id:'discipline', icon:'discipline', name:'Discipline Team', tagline:'Keeps things on track', heads:['Rupinder Singh'] },
    { id:'promotion', icon:'promotion', name:'Promotion Team', tagline:'Gets the word out', heads:['To be announced'] }
  ];

  var teamGrid = document.getElementById('teamGrid');
  teams.forEach(function(t){
    var btn = document.createElement('button');
    btn.className = 'team-card';
    btn.type = 'button';
    btn.setAttribute('aria-pressed','false');
    btn.dataset.id = t.id;
    btn.innerHTML =
      '<span class="icon">'+svgIcon(t.icon)+'</span>'+
      '<span class="name">'+t.name+'</span>'+
      '<span class="tagline">'+t.tagline+'</span>';
    teamGrid.appendChild(btn);
  });

  var pointer = document.getElementById('pointer');
  var panel = document.getElementById('teamPanel');
  var activeId = null;

  function initials(name){
    if(name === 'To be announced') return 'TBA';
    var parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }

  function renderPanel(team){
    var headsHtml = team.heads.map(function(h){
      return '<div class="head-chip"><span class="head-node">'+initials(h)+'</span><span class="head-name">'+h+'</span></div>';
    }).join('');
    panel.innerHTML =
      '<div class="panel-name">'+team.name+'</div>'+
      '<div class="panel-tag">'+team.tagline.replace('&amp;','&')+'</div>'+
      '<div class="heads-row">'+headsHtml+'</div>';
  }

  function closePanel(){
    panel.classList.remove('open');
    pointer.classList.remove('show');
    activeId = null;
    teamGrid.querySelectorAll('.team-card').forEach(function(c){ c.setAttribute('aria-pressed','false'); });
    panel.innerHTML = '<p class="hint" id="teamHint">Select a team above to see who leads it.</p>';
  }

  teamGrid.addEventListener('click', function(e){
    var btn = e.target.closest('.team-card');
    if(!btn) return;
    var id = btn.dataset.id;

    if(id === activeId){
      closePanel();
      return;
    }

    teamGrid.querySelectorAll('.team-card').forEach(function(c){ c.setAttribute('aria-pressed', c === btn ? 'true' : 'false'); });
    var team = teams.filter(function(t){ return t.id === id; })[0];
    renderPanel(team);
    panel.classList.add('open');
    activeId = id;

    var gridRect = teamGrid.getBoundingClientRect();
    var btnRect = btn.getBoundingClientRect();
    var centerPx = (btnRect.left - gridRect.left) + (btnRect.width / 2);
    pointer.style.left = centerPx + 'px';
    pointer.classList.add('show');
  });

  window.addEventListener('resize', function(){
    if(!activeId) return;
    var btn = teamGrid.querySelector('.team-card[aria-pressed="true"]');
    if(!btn) return;
    var gridRect = teamGrid.getBoundingClientRect();
    var btnRect = btn.getBoundingClientRect();
    pointer.style.left = ((btnRect.left - gridRect.left) + (btnRect.width/2)) + 'px';
  });

  /* ---------- what we do ---------- */
  var activities = [
    { icon:'robot', name:'Robotics Projects', desc:'Hands-on builds — from line followers to robotic arms.' },
    { icon:'gear', name:'Workshops', desc:'Arduino, 3D printing, PCB design, and CAD fundamentals.' },
    { icon:'trophy', name:'Competitions', desc:'Representing GNDEC at inter-college robotics events.' },
    { icon:'screen', name:'Technical Sessions', desc:'Talks and demos on tools, parts, and techniques worth knowing.' },
    { icon:'bulb', name:'Innovation &amp; Prototyping', desc:'Turning rough ideas into working, testable prototypes.' },
    { icon:'nodes', name:'Team-Based Challenges', desc:'Build sprints that mix mechanical, electronics, and code skills.' }
  ];
  var activityGrid = document.getElementById('activityGrid');
  activities.forEach(function(a){
    var card = document.createElement('div');
    card.className = 'activity-card';
    card.innerHTML =
      '<span class="icon">'+svgIcon(a.icon)+'</span>'+
      '<h3>'+a.name+'</h3>'+
      '<p>'+a.desc+'</p>';
    activityGrid.appendChild(card);
  });

  /* ---------- contact links (placeholders — update with real handles) ---------- */
  document.getElementById('igLink').href = 'https://instagram.com/gndec.robotics';
  document.getElementById('emailLink').href = 'mailto:robotics.club@gndec.ac.in';

  /* ---------- footer year ---------- */
  document.getElementById('footYear').textContent = '© ' + new Date().getFullYear() + ' Robotics Club, GNDEC. All systems go.';
  /* ---------- scroll reveal ---------- */
  var revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window){
    var revealObserver = new IntersectionObserver(function(entries, observer){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.12});
    revealItems.forEach(function(el){ revealObserver.observe(el); });
  } else {
    revealItems.forEach(function(el){ el.classList.add('visible'); });
  }

  /* ---------- subtle cursor glow on desktop ---------- */
  if (window.matchMedia('(pointer:fine)').matches){
    var glow = document.createElement('div');
    glow.style.cssText = 'position:fixed;left:0;top:0;width:260px;height:260px;border-radius:50%;pointer-events:none;z-index:1;background:radial-gradient(circle,rgba(0,200,255,.07),transparent 68%);transform:translate(-50%,-50%);transition:opacity .25s ease;opacity:0;';
    document.body.appendChild(glow);
    window.addEventListener('pointermove', function(e){
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      glow.style.opacity = '1';
    });
  }

  /* ---------- registration checkbox feedback ---------- */
  var registerBtn = document.getElementById('registerInterestBtn');
  var registerStatus = document.getElementById('registerStatus');
  if(registerBtn){
    registerBtn.addEventListener('click', function(){
      var selected = Array.prototype.slice.call(
        document.querySelectorAll('#registration input[name="interest"]:checked')
      );
      if(!selected.length){
        registerStatus.textContent = 'Please select at least one interest.';
        return;
      }
      var labels = selected.map(function(input){
        return input.parentElement.querySelector('span').textContent.trim();
      });
      registerStatus.textContent = 'Selected: ' + labels.join(' • ');
    });
  }

})();
