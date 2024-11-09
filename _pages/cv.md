---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

[Download CV](CV_sichao.pdf)

Education
======
* B.S. in Mechanical Engineering, Shanghai Ocean University, 2018
* M.S. in Computer Science, Australian National University, 2020
* Ph.D in Computational Science, Australian National University, 2024 (expected)

Research Experience
======
* PhD with primary supervisor Prof. Amanda Barnard --- Design-driven Materials Intelligence
  * Australian National University, Canberra
  * Duties included: applying AI/ML to speed up the material discovery
 
* Research Assistant with supervisor Prof. Steve Blackburn --- The Dacapo Bench
  * Australian National University, Canberra
  * Duties included: Building Dacapo Benchmark on the latest version of JDK

* Research Assistant with supervisor Dr. Charles Martin --- Generating complex melodies on an
Edge TPU
  * Australian National University, Canberra
  * Duties included: Deploying a Recurrent Neutral Network on an Edge TPU to generate music
  
Skills
======
* Scientific Problem Solving
  * Defining and analyzing complex scientific problems
  * Developing and implementing innovative data-driven and domain-driven methodologies
* Explainable Artificial Intelligence
  * Addressing the explanation disagreement problem in AI systems
  * Bridging the gap between algorithms, human understanding, and real-world problem

Publications
======
{% if site.author.googlescholar %}
  <div class="wordwrap">All my publications can be found on <a href="{{site.author.googlescholar}}">my Google Scholar profile</a>.</div>
{% endif %}

<br/><br/>
  
Teaching and Supervising
======
  <ul>{% for post in site.teaching %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  
Service
======
* Reviewer: ICML; Neurips; ICLR; AISTATS; IJCNN; Cell Reports Physical Science; Scientific Report
