// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { createElement, setSliderValue, bindSlider, setText, clearChildren } from '../src/utils/dom.js';

describe('dom.js utilities', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('createElement creates elements with attributes and children', () => {
        const child = document.createElement('span');
        child.textContent = 'text';
        const el = createElement('div', { id: 'test', className: 'box', 'data-info': '123' }, [child, ' appended']);
        
        expect(el.tagName).toBe('DIV');
        expect(el.id).toBe('test');
        expect(el.className).toBe('box');
        expect(el.dataset.info).toBe('123');
        expect(el.childNodes.length).toBe(2);
        expect(el.lastChild.textContent).toBe(' appended');
    });

    it('setSliderValue updates slider and display element', () => {
        document.body.innerHTML = `
            <input type="range" id="ctrl-intensity" />
            <span id="val-intensity"></span>
        `;
        
        setSliderValue('ctrl-intensity', 5.5, 1);
        
        const slider = document.getElementById('ctrl-intensity');
        const display = document.getElementById('val-intensity');
        
        expect(slider.value).toBe('5.5');
        expect(display.textContent).toBe('5.5');
    });

    it('setText updates textContent', () => {
        document.body.innerHTML = '<div id="target">old</div>';
        setText('target', 'new');
        expect(document.getElementById('target').textContent).toBe('new');
    });

    it('clearChildren removes all child nodes', () => {
        const container = document.createElement('div');
        container.appendChild(document.createElement('span'));
        container.appendChild(document.createElement('span'));
        
        clearChildren(container);
        expect(container.childNodes.length).toBe(0);
    });
});
