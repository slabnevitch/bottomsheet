import {findHighestZIndex} from './util/zIndexManager.js';

export class BottomSheet {
  status = {};

  // required
  parents = '';
  html = '';
  elemSelector = '.frontleBottomSheet';
  // options
  height = 50;
  startY = 0;
  sheetClass = 'huy';
  contentsClass = 'huy';
  backgroundClass = 'huy';
  backgroundClickExit = true;
  id = String(BottomSheet.makeID(32));
  sheetId = 'sheet_' + this.id;
  zIndex = findHighestZIndex(this.parents);

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
    this.elem = document.querySelector(this.elemSelector);
    

    // get z-index

    // set sheet id

    // set status
    this.status[this.sheetId] = {};
    this.status[this.sheetId].mousedown = false;
    this.status[this.sheetId].mouseup = false;

    // add sheet
    const sheetElement = this.elem;
  

    sheetElement.querySelector('.frontleBottomSheetBackground').classList.add(this.backgroundClass);
    sheetElement.querySelector('.frontleBottomSheetContents').classList.add(this.contentsClass);
    sheetElement.querySelector('.frontleBottomSheetContents').style = `max-height: ${this.height}vh;
        height: ${this.height}vh;
        z-index: ${this.zIndex + 2};
        bottom: -${this.height}vh;`;

    sheetElement.setAttribute('id', this.sheetId);
    sheetElement.classList.add(this.sheetClass);
    // sheetElement.innerHTML = html;
    sheetElement.style.zIndex = String(this.zIndex);
    // document.querySelector(this.parents).append(sheetElement);
  }

  async open() {
    // create id

    // run lifecycle
    await this.beforeOpen(this.heetId);

    // start sheet animation
    setTimeout(() => {
      // background opacity
      const sheetBackground = sheetElement.querySelector('.frontleBottomSheetBackground');
        console.log(sheetBackground)

      if (sheetBackground !== null) {
        sheetBackground.style.opacity = '0.4';
      }

      // contents pos move up
      const sheetContents = sheetElement.querySelector('.frontleBottomSheetContents');
      if (sheetContents !== null) {
        sheetContents.style.bottom = `${this.startY}vh`;
      }
    }, 100);

    // end sheet animation
    setTimeout(async () => {
      // set mouse down event
      const sheetBar = sheetElement.querySelector('.frontleBottomSheetBar');
      if (sheetBar !== null) {
        this.status[sheetId].mouseDownEvent = e => {
          e.preventDefault();
          this.eventMouseDown(sheetId);
        };
        sheetBar.addEventListener('mousedown', this.status[sheetId].mouseDownEvent, false);

        this.status[sheetId].touchStartEvent = () => {
          this.eventMouseDown(sheetId);
        };
        sheetBar.addEventListener('touchstart', this.status[sheetId].touchStartEvent, false);
      }

      const sheetContents = sheetElement.querySelector('.frontleBottomSheetContents');

      // set mouse up event
      this.status[sheetId].mouseUpEvent = e => {
        e.preventDefault();
        this.eventMouseUp(e, sheetId, sheetContents);
      };
      document.addEventListener('mouseup', this.status[sheetId].mouseUpEvent, false);

      this.status[sheetId].touchEndEvent = e => {
        this.eventMouseUp(e.changedTouches[0], sheetId, sheetContents);
      };
      document.addEventListener('touchend', this.status[sheetId].touchEndEvent, false);

      // set mouse move event
      this.status[sheetId].mouseMoveEvent = e => {
        e.preventDefault();
        this.eventMouseMove(e, sheetId, sheetContents);
      };
      document.addEventListener('mousemove', this.status[sheetId].mouseMoveEvent, false);

      this.status[sheetId].touchMoveEvent = e => {
        this.eventMouseMove(e.changedTouches[0], sheetId, sheetContents);
      };
      document.addEventListener('touchmove', this.status[sheetId].touchMoveEvent, false);

      // set close event
      if (this.backgroundClickExit === true) {
        const sheetBackground = sheetElement.querySelector('.frontleBottomSheetBackground');
        if (sheetBackground !== null) {
          sheetBackground.addEventListener(
            'click',
            () => {
              this.close(sheetId);
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
      await this.afterOpen(sheetId);
    }, 0.4 * 1000 + 100);

    return sheetId;
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

      delete this.status[sheetID];

      // remove sheet
      if (sheetElement !== null) sheetElement.remove();

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
