import {findHighestZIndex} from './util/zIndexManager.js';

export class BottomSheet {
  status = {};

  // required
  parents = '';
  html = '';

  // options
  height = 100;
  startY = 0;
  sheetClass = 'huy';
  contentsClass = 'huy';
  backgroundClass = 'huy';
  backgroundClickExit = true;
  id = String(BottomSheet.makeID(32));
  sheetId = 'sheet_' + this.id;
  zIndex = findHighestZIndex(this.parents);
  elem = document.querySelector( '.frontleBottomSheet');
  sheetElement = this.elem;

  beforeOpen = () => {};
  afterOpen = () => {};
  beforeEnd = () => {};
  afterEnd = () => {};

  constructor(parents, html) {
    if (parents === null) {
      throw {
        message: 'parents must be entered',
      };
    }
    if (html === null) {
      throw {message: 'html must be entered'};
    }

    this.parents = parents;
    this.html = html;
    

    // get z-index

    // set sheet id

   

    // add sheet
  
    console.log('height '  + this.height)
    this.sheetElement.querySelector('.frontleBottomSheetBackground').classList.add(this.backgroundClass);
    this.sheetElement.querySelector('.frontleBottomSheetContents').classList.add(this.contentsClass);
    this.sheetElement.querySelector('.frontleBottomSheetContents').style = `max-height: ${this.height}vh;
        height: ${this.height}vh;
        z-index: ${this.zIndex + 2};
        bottom: -${this.height}vh;`;

    this.sheetElement.setAttribute('id', this.sheetId);
    this.sheetElement.classList.add(this.sheetClass);
    // sheetElement.innerHTML = html;
    this.sheetElement.style.zIndex = String(this.zIndex);
    // document.querySelector(this.parents).append(sheetElement);
  }

  async open() {
    // create id
    this.sheetElement.style.visibility = 'visible';
    // run lifecycle
    await this.beforeOpen(this.heetId);

     // set status
    this.status[this.sheetId] = {};
    this.status[this.sheetId].mousedown = false;
    this.status[this.sheetId].mouseup = false;

    // start sheet animation
    setTimeout(() => {
      // background opacity
      const sheetBackground = this.sheetElement.querySelector('.frontleBottomSheetBackground');
        console.log(sheetBackground)

      if (sheetBackground !== null) {
        sheetBackground.style.opacity = '0.4';
      }

      // contents pos move up
      const sheetContents = this.sheetElement.querySelector('.frontleBottomSheetContents');
      if (sheetContents !== null) {
        sheetContents.style.bottom = `${this.startY}vh`;
      }
    }, 100);

    // end sheet animation
    setTimeout(async () => {
      // set mouse down event
      const sheetBar = this.sheetElement.querySelector('.frontleBottomSheetBar');
      if (sheetBar !== null) {

        console.log( this.status[this.sheetId])
        this.status[this.sheetId].mouseDownEvent = e => {
          e.preventDefault();
          this.eventMouseDown(this.sheetId);
        };
        sheetBar.addEventListener('mousedown', this.status[this.sheetId].mouseDownEvent, false);

        this.status[this.sheetId].touchStartEvent = () => {
          this.eventMouseDown(this.sheetId);
        };
        sheetBar.addEventListener('touchstart', this.status[this.sheetId].touchStartEvent, false);
      }

      const sheetContents = this.sheetElement.querySelector('.frontleBottomSheetContents');

      // set mouse up event
      this.status[this.sheetId].mouseUpEvent = e => {
        e.preventDefault();
        this.eventMouseUp(e, this.sheetId, sheetContents);
      };
      document.addEventListener('mouseup', this.status[this.sheetId].mouseUpEvent, false);

      this.status[this.sheetId].touchEndEvent = e => {
        this.eventMouseUp(e.changedTouches[0], this.sheetId, sheetContents);
      };
      document.addEventListener('touchend', this.status[this.sheetId].touchEndEvent, false);

      // set mouse move event
      this.status[this.sheetId].mouseMoveEvent = e => {
        e.preventDefault();
        this.eventMouseMove(e, this.sheetId, sheetContents);
      };
      document.addEventListener('mousemove', this.status[this.sheetId].mouseMoveEvent, false);

      this.status[this.sheetId].touchMoveEvent = e => {
        this.eventMouseMove(e.changedTouches[0], this.sheetId, sheetContents);
      };
      document.addEventListener('touchmove', this.status[this.sheetId].touchMoveEvent, false);

      // set close event
      if (this.backgroundClickExit === true) {
        const sheetBackground = this.sheetElement.querySelector('.frontleBottomSheetBackground');
        if (sheetBackground !== null) {
          sheetBackground.addEventListener(
            'click',
            () => {
              this.close(this.sheetId);
            },
            false,
          );
        }
      }

      // delete animation
      if (sheetContents !== null) {
        sheetContents.style.removeProperty('transition');
      }

      // run lifecycle
      await this.afterOpen(this.sheetId);
    }, 0.4 * 1000 + 100);

    return this.sheetId;
  }

  async close(sheetID) {
    // run lifecycle

    await this.beforeEnd(sheetID);

    const sheetElement = document.getElementById(sheetID);

    // background opacity
    const sheetBackground = sheetElement.querySelector('.frontleBottomSheetBackground');
    if (sheetBackground !== null) sheetBackground.style.opacity = '0';

    // contents pos move down
    const sheetContents = sheetElement.querySelector('.frontleBottomSheetContents');
    if (sheetContents !== null) {
      sheetContents.style.transition = 'bottom ease 0.4s 0s';
      sheetContents.style.bottom = `-${this.height}vh`;
    }

    // end sheet animation
    setTimeout(async () => {
      document.removeEventListener('mousedown', this.status[sheetID].mouseDownEvent);
      document.removeEventListener('touchstart', this.status[sheetID].touchStartEvent);

      document.removeEventListener('mousemove', this.status[sheetID].mouseMoveEvent);
      document.removeEventListener('touchmove', this.status[sheetID].touchMoveEvent);

      document.removeEventListener('mouseup', this.status[sheetID].mouseUpEvent);
      document.removeEventListener('touchend', this.status[sheetID].touchEndEvent);

      // delete this.status[sheetID];

      // remove sheet
      // if (sheetElement !== null) sheetElement.remove();

      // run lifecycle

      await this.afterEnd(sheetID);
    }, 0.4 * 1000);
  }

  eventMouseDown(sheetID) {
    if (this.status[sheetID].mouseup === false) {
      this.status[sheetID].mousedown = true;
    }
  }

  eventMouseUp(e, sheetID, element) {
    // if mouse down
    if (this.status[sheetID].mousedown) {
      this.status[sheetID].mousedown = false;
      this.status[sheetID].mouseup = true;

      // positioning
      let mouseY = window.innerHeight - e.clientY;
      if (mouseY < 0) mouseY = 0;
      if (mouseY > window.innerHeight) mouseY = window.innerHeight;
      let moveY = (mouseY / window.innerHeight) * 100 - Number(this.height);
      if (moveY >= 0) moveY = 0;

      // Move to full height
      if (Number(moveY) >= Number(this.startY)) {
        let bottomVH;
        if (Number(this.startY) / 2 <= Number(moveY)) {
          bottomVH = 0;
        } else {
          bottomVH = this.startY;
        }

        // start animation
        element.style.transition = 'bottom ease 0.4s 0s';
        element.style.bottom = `${bottomVH}vh`;

        // end animation
        setTimeout(() => {
          element.style.removeProperty('transition');

          this.status[sheetID].mouseup = false;
        }, 400);
      }
      // close bottom sheet
      else {
        this.close(sheetID);
      }
    }
  }

  eventMouseMove(e, sheetID, element) {
    if (this.status[sheetID].mousedown) {
      let mouseY = window.innerHeight - e.clientY;
      if (mouseY < 0) mouseY = 0;
      if (mouseY > window.innerHeight) mouseY = window.innerHeight;

      let moveY = (mouseY / window.innerHeight) * 100 - Number(this.height);
      if (moveY >= 0) moveY = 0;
      element.style.bottom = `${moveY}vh`;
    }
  }

  static makeID(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
