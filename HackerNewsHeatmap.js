// ==UserScript==
// @name         HackerNews most active posts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight most active HN posts
// @author       shiloa
// @match        https://news.ycombinator.com/*
// @grant        none
// ==/UserScript==

const SCORE_CLASS = ".score"

/**
 * Generate HSL value for heatmap for given value between [0, 1]
 * values taken from http://colorbrewer2.org/#type=sequential&scheme=YlOrRd&n=9
 * @param {float} - float in range [0, 1]
 * @returns heatmap color value
 */
const getHeatmapForValue = (value) => {
    if (value >= 0 && value < 0.12) {
        return { bg: '#ffffcc', fg: 'black' };
    } else if (value >= 0.12 && value < 0.24) {
        return { bg: '#ffeda0', fg: 'black' };
    } else if (value >= 0.24 && value < 0.36) {
        return { bg: '#fed976', fg: 'gray' };
    } else if (value >= 0.36 && value < 0.48) {
        return { bg: '#feb24c', fg: 'white' };
    } else if (value >= 0.48 && value < 0.60) {
        return { bg: '#fd8d3c', fg: 'white' };
    } else if (value >= 0.60 && value < 0.72) {
        return { bg: '#fc4e2a', fg: 'white' };
    } else if (value >= 0.72 && value < 0.84) {
        return { bg: '#e31a1c', fg: 'white' };
    } else if (value >= 0.84 && value < 0.96) {
        return { bg: '#bd0026', fg: 'white' };
    } else {
        return { bg: '#800026', fg: 'white' };
    }
}

(function() {
    'use strict';
    const scoreElements = Array.prototype.slice.call(document.querySelectorAll(SCORE_CLASS));

    const scores = [];

    for (let i = 0; i < scoreElements.length ; i++) {
        const el = scoreElements[i];

        const entry = {
            scoreId: el.id,
            score: parseInt(el.innerText),
        }

        scores.push(entry)
    }

    // sort scores ascending
    scores.sort((x, y) => x.score >= y.score)

    // calculate max score
    const scoreList = scores.map(s => s.score)
    const maxScore = Math.max(...scoreList)

    // update visual ranks
    for (let i = 0; i < scores.length ; i++) {
        const { scoreId, score } = scores[i]
        const rank = 1.0 * score/maxScore;
        const heatmap = getHeatmapForValue(rank)

        // set background, foreground colors and border radius for score components
        document.querySelector(`#${scoreId}`).style['background-color'] = heatmap.bg;
        document.querySelector(`#${scoreId}`).style.color = heatmap.fg;
        document.querySelector(`#${scoreId}`).style['border-radius'] = '2px';

        // console.debug(`debug HN heatmap: score=${score}, maxScore=${maxScore}, rank=${rank}, heatmap=${heatmap}`)
    }

})();
