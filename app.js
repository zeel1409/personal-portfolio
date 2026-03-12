document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  function initializeSkillBars() {
    const skillsSection = document.querySelector("#skills");
    if (!skillsSection) return;

    const existingSkills = skillsSection.querySelectorAll("[data-skill-name]");

    if (existingSkills.length === 0) {
      const skills = [
        { name: "HTML5", level: 85 },
        { name: "CSS3", level: 80 },
        { name: "JavaScript", level: 70 },
        { name: "Responsive Design", level: 75 },
      ];

      const skillsContainer = document.createElement("div");
      skillsContainer.className = "skill-bars";

      skills.forEach((skill) => {
        const skillBar = document.createElement("div");
        skillBar.className = "skill-bar";
        skillBar.innerHTML = `
                    <div class="skill-info">
                        <span class="skill-name">${skill.name}</span>
                        <span class="skill-percent">${skill.level}%</span>
                    </div>
                    <div class="skill-progress">
                        <div class="skill-progress-fill" data-level="${skill.level}"></div>
                    </div>
                `;
        skillsContainer.appendChild(skillBar);
      });

      skillsSection.appendChild(skillsContainer);
    }
  }

  initializeSkillBars();

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        if (entry.target.id === "skills") {
          const skillFills = entry.target.querySelectorAll(
            ".skill-progress-fill",
          );
          skillFills.forEach((fill, index) => {
            const level = fill.getAttribute("data-level");
            setTimeout(() => {
              fill.style.width = level + "%";
            }, 100 * index);
          });
        }
      }
    });
  }, observerOptions);

  // Observe all sections
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    section.classList.add("fade-in");
    observer.observe(section);
  });

  function makeContactLinksClickable() {
    const contactItems = document.querySelectorAll(".contact-item");

    contactItems.forEach((item) => {
      // Check if already has data attributes
      const type = item.dataset.type;
      const value = item.dataset.value;

      if (type && value) {
        // Use data attributes from HTML
        applyContactLink(item, type, value);
      } else {
        // Fallback: detect from content
        const heading = item.querySelector("h3")?.textContent.toLowerCase();
        const linkElement = item.querySelector("a, p");
        if (!linkElement) return;

        const content = linkElement.textContent.trim();
        applyContactLink(item, heading, content);
      }
    });
  }

  function applyContactLink(item, type, value) {
    const linkElement = item.querySelector("a, p");
    if (!linkElement) return;

    let href = "";
    let displayText = value;

    switch (type) {
      case "email":
        href = `mailto:${value}`;
        break;
      case "phone":
        href = `tel:${value.replace(/\s+/g, "")}`;
        break;
      case "linkedin":
        href = value.startsWith("http") ? value : `https://${value}`;
        break;
      case "github":
        href = value.startsWith("http") ? value : `https://${value}`;
        break;
      default:
        return;
    }

    linkElement.innerHTML = `<a href="${href}" target="_blank" rel="noopener noreferrer">${displayText}</a>`;
  }

  makeContactLinksClickable();

  let scrollTimeout;

  function updateActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  // Throttled scroll handler for better performance
  window.addEventListener("scroll", () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateActiveNav, 50);
  });

  // Initial call
  updateActiveNav();

  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  console.log("✅ Portfolio initialized successfully!");
});
