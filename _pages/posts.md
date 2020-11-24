---
layout: default
title: "Posts"
permalink: /posts/
---

<div class="tags">
  <div class="tags-header">
    <h2 class="tags-header-title">{{ page.title }}</h2>
    <div class="tags-header-line"></div>
  </div>
  <div class="tags-clouds">
    {% for post in site.posts -%}
    {% capture this_year %}{{ post.date | date: "%Y" }}{% endcapture -%}
    {% capture next_year %}{{ post.previous.date | date: "%Y" }}{% endcapture -%}
    {% if forloop.first %}<a href="#{{ this_year }}">{{ this_year }}</a>{% endif -%}
    {% unless forloop.last -%}
    {% if this_year != next_year %}<a href="#{{ next_year }}">{{ next_year }}</a>{% endif -%}
    {% endunless -%}
    {% endfor -%}
  </div>
  {% for post in site.posts -%}
    {% capture this_year %}{{ post.date | date: "%Y" }}{% endcapture -%}
    {% capture next_year %}{{ post.previous.date | date: "%Y" }}{% endcapture -%}
    {% if forloop.first -%}
  <div class="tags-item" id="{{ this_year }}">
    <h2 class="tags-item-label">{{ this_year }}</h2>
    {% endif -%}
    <a class="tags-post" href="{{ post.url | prepend: site.baseurl }}">
      <div>
        <span class="tags-post-title">{{ post.title }}</span>
        <div class="tags-post-line"></div>
      </div>
      <span class="tags-post-meta">
        <time datetime="{{ post.date }}">
          {{ post.date | date:"%Y-%m-%d" }}
        </time>
      </span>
    </a>
    {% if forloop.last -%}
  </div>
    {% else -%}
        {% if this_year != next_year -%}
  </div>
  <div class="tags-item" id="{{ next_year }}">
    <h2 class="tags-item-label">{{ next_year }}</h2>
        {% endif -%}
    {% endif -%}
  {% endfor -%}
</div>
