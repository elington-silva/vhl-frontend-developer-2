<template>
  <div>
    <div v-for="(data) in data" :key="`line-${data.id}`">
      <svg
        class="svg"
        v-for="(line) in data.parent"
        :key="`line-${data.id}-${line}`"
        :id="`line-${data.id}-${line}`"
      >
        <line @click.prevent.stop="deleteConnection(data.id, line)" class="line" />
        <line @click.prevent.stop="deleteConnection(data.id, line)" class="line" />
        <line @click.prevent.stop="deleteConnection(data.id, line)" class="line" />
      </svg>
    </div>

    <div
      :class="`type-${ar.type}`"
      class="type"
      :style="{ top: `${ar.position[0]}px`, left: `${ar.position[1]}px`}"
      v-dragged="onDragged"
      v-for="(ar, i) in data"
      :key="ar.id"
      @mouseover="showPlus($event, ar.id)"
      @click.prevent.stop="showPlus($event, ar.id)"
      :id="`item-${ar.id}`"
    >
      <span
        v-show="ar.id != 1 && newConect == undefined"
        class="btn-hover delete"
        @click.prevent.stop="deleteItem(ar.id)"
      >
        <i class="fas fa-times auto"></i>
      </span>

      <span
        v-show="ar.id != 1 && (newConect == undefined || newConect == ar.id) "
        :class="{'newConect': newConect == ar.id}"
        class="btn-hover connection child"
        @click.prevent.stop="addConnection(ar.id, 0)"
      >
        <i class="fas fa-arrow-left auto"></i>
      </span>

      <span
        v-show="newConect != undefined && newConect != ar.id && selected.parent.indexOf(ar.id) == -1"
        :class="{'newConect': newConect != undefined && newConect != ar.id && selected.parent.indexOf(ar.id) == -1}"
        class="btn-hover connection father"
        @click.prevent.stop="addConnection(ar.id, 1)"
      >
        <i class="fas fa-arrow-right auto"></i>
      </span>

      <span class="icon">
        <i class="auto" :class="ar.icon"></i>
      </span>
      <span>
        <label class="name">{{ar.name}}</label>
        <label class="described">
          <label v-if="ar.type == 2" class="status"></label>
          {{ar.described}}
        </label>
      </span>
      <span v-if="ar.type == 2" class="arrow" @click.stop="showDetails(i)" style="z-index: 10;"></span>

      <span v-if="ar.type == 2" class="arrow">
        <span v-show="ar.view" class="auto">
          <i class="fas fa-chevron-up"></i>
        </span>
        <span v-show="!ar.view" class="auto">
          <i class="fas fa-chevron-down"></i>
        </span>
      </span>
      <div v-if="ar.type == 2 && ar.view" class="details">
        <div class="x">
          <div class="y">Details</div>
        </div>
      </div>
    </div>

    <div ref="plus" class="p" style="display:none;">
      <div class="plus" @click.prevent.stop="showOption($event)">
        <i class="fas fa-plus auto"></i>
      </div>
    </div>

    <div ref="options" style="display:none;" class="options">
      <span class="item" style="color: #d54a83;" @click="newItem(1)">
        <i style="margin-right: 10px;" class="far fa-circle"></i> Touchpoint
      </span>
      <span class="item" style="color: #634ade;" @click="newItem(2)">
        <i style="margin-right: 10px;" class="far fa-clone fa-rotate-90 fa-flip-horizontal"></i> View
      </span>
      <span class="item" style="color: #3bc5ce;" @click="newItem(3)">
        <i style="margin-right: 10px;" class="fas fa-bolt"></i> Logic
      </span>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "ContainerMain",
  data() {
    return {
      newConect: undefined,
      selected: null,
      plus: false,
      options: false,
      data: new Array(),
      zindex: 0,
      isDeleteItem: false
    };
  },
  mounted() {
    if (sessionStorage.data) {
      this.data = JSON.parse(sessionStorage.data);
    } else {
      this.getdata();
    }
  },
  created() {
    // window.onmousemove = event => {
    //   var height = document.documentElement.scrollHeight;
    //   var width = document.documentElement.scrollWidth;
    //   var y = event.clientY;
    //   var x = event.clientX;
    //   var yPercentage = y / screen.height;
    //   var xPercentage = x / screen.width;
    //   window.scrollTo(xPercentage * width, yPercentage * height);
    // };
    window.onclick = () => {
      this.close();
    };
  },
  updated() {
    this.lineCSS();
  },
  methods: {
    getdata() {
      axios.get("/datasource/data.json").then(r => {
        this.data = r.data;
      });
    },
    addConnection(id, type) {
      let self = this;
      switch (type) {
        case 0:
          this.newConect = id;
          break;
        case 1:
          this.data.forEach(function(data) {
            if (data.id == self.newConect) {
              if (data.parent == undefined) data.parent = new Array();
              data.parent.push(id);
              self.newConect = undefined;
            }
          });
          break;
      }
      sessionStorage.data = JSON.stringify(this.data);
    },
    deleteConnection(child, father) {
      this.data.forEach(function(data) {
        if (data.id == child) {
          if (data.parent) {
            data.parent.forEach(function(parent, index) {
              if (parent == father) {
                data.parent.splice(index, 1);
              }
            });
          }
        }
      });
      sessionStorage.data = JSON.stringify(this.data);
    },
    showDetails(i) {
      this.data.forEach(function(data, index) {
        if (index == i) {
          data.view = !data.view;
        } else {
          data.view = false;
        }
      });
      sessionStorage.data = JSON.stringify(this.data);
      this.$refs.plus.setAttribute(`style`, `display:none;`);
    },
    newItem(type) {
      if (type == 3) return;
      let detail = document.getElementById(`item-${this.selected.id}`);
      let name = type == 1 ? "Touchpoint" : "View";
      let id = this.data[this.data.length - 1].id + 1;
      this.data.push({
        id: id,
        name: `New ${name} ${id}`,
        described: "Created today",
        type: type,
        parent: [this.selected.id],
        position: [
          this.selected.position[0],
          this.selected.position[1] + detail.offsetWidth + 75
        ],
        view: false
      });

      let father = this.selected.id;
      setTimeout(() => {
        let child = document.getElementById(`item-${id}`);
        if (type == 1) child.classList.add("top-bottom");
        let line = document.getElementById(`line-${id}-${father}`);
        line.classList.add("line-animation");
        setTimeout(() => {
          child.classList.remove("top-bottom");
          line.classList.remove("line-animation");
        }, 1000);
      }, 0);
    },
    deleteItem(item) {
      this.isDeleteItem = true;
      let self = this;
      this.data.forEach(function(data, index) {
        self.deleteConnection(data.id, item);
        if (data.id == item) {
          self.data.splice(index, 1);
        }
      });
      this.isDeleteItem = false;
      self.close();
      sessionStorage.data = JSON.stringify(this.data);
    },
    close() {
      this.closeDetails();
      this.newConect = undefined;
      if (!this.isDeleteItem) {
        if (!this.plus) return;
        this.$refs.plus.setAttribute(`style`, `display:none;`);
        if (!this.options) return;
        this.$refs.options.setAttribute(`style`, `display:none;`);
      }
    },
    closeDetails() {
      this.data.forEach(function(data) {
        data.view = false;
      });
    },
    lineCSS() {
      let _father = undefined;
      let _child = undefined;
      this.data.forEach(function(data) {
        _child = data.id;
        if (data.parent) {
          let _parent = data.parent.length;
          data.parent.forEach(function(parent) {
            _father = parent;
            let father = document.getElementById(`item-${_father}`);
            let child = document.getElementById(`item-${_child}`);
            let line = document.getElementById(`line-${_child}-${_father}`);
            if (!father) return;
            if (!child) return;
            if (!line) return;

            var x1 = father.offsetLeft + father.offsetWidth / 3;
            var y1 = father.offsetTop + father.offsetHeight / 2;
            var x2 = child.offsetLeft + child.offsetWidth / 3;
            var y2 = child.offsetTop + child.offsetHeight / 2;

            if (_parent == 2) {
              line.childNodes[2].setAttribute("x1", child.offsetLeft - 30);
              line.childNodes[2].setAttribute(
                "y1",
                child.offsetTop + child.offsetHeight / 2
              );
              line.childNodes[2].setAttribute("x2", child.offsetLeft);
              line.childNodes[2].setAttribute(
                "y2",
                child.offsetTop + child.offsetHeight / 2
              );
              x2 = child.offsetLeft - 30;
            } else {
              line.childNodes[2].setAttribute("x1", 0);
              line.childNodes[2].setAttribute("y1", 0);
              line.childNodes[2].setAttribute("x2", 0);
              line.childNodes[2].setAttribute("y2", 0);
            }
            let _line = [];
            let _column = [];
            let isLine = line.childNodes[0];
            let isColumn = line.childNodes[1];

            if (data.type == 2) {
              isLine.style.stroke = "#6b4ad6";
              isColumn.style.stroke = "#6b4ad6";
            }

            if (_parent == 1) {
              _line = [x1, y2, x2, y2];
              _column = [x1, y1, x1, y2];
            } else if (_parent == 2) {
              _line = [x1, y1, x2, y1];
              _column = [x2, y1, x2, y2];
            } else {
              _line = [
                _father * 5 + x1,
                _father * 5 + y1,
                _father * 5 + x2,
                _father * 5 + y1
              ];
              _column = [
                _father * 5 + x2,
                _father * 5 + y1,
                _father * 5 + x2,
                _father * 5 + y2
              ];
            }

            isLine.setAttribute("x1", _line[0]);
            isLine.setAttribute("y1", _line[1]);
            isLine.setAttribute("x2", _line[2]);
            isLine.setAttribute("y2", _line[3]);
            isColumn.setAttribute("x1", _column[0]);
            isColumn.setAttribute("y1", _column[1]);
            isColumn.setAttribute("x2", _column[2]);
            isColumn.setAttribute("y2", _column[3]);
          });
        }
      });
    },
    showPlus(event, i) {
      if (this.newConect) return;
      this.plus = true;
      this.$refs.options.setAttribute(`style`, `display:none;`);
      var self = this;
      this.data.forEach(function(data) {
        if (data.id == i) {
          self.selected = data;
        }
      });

      let zindex = this.zindex++;
      let detail = document.getElementById(`item-${i}`);
      detail.style.zIndex = zindex;

      let left = detail.offsetLeft + detail.offsetWidth + 20;
      let top = detail.offsetTop + 13;
      this.$refs.plus.setAttribute(`style`, `top: ${top}px; left: ${left}px`);
    },
    showOption() {
      this.options = true;

      let options = document.getElementsByClassName("options");

      let detail = this.$refs.plus;
      let left = detail.offsetLeft + detail.offsetWidth;
      let top = detail.offsetTop + 13 - 110;
      let zindex = this.zindex++;

      if (top < 0) top = 10;

      this.$refs.options.setAttribute(
        `style`,
        `top: ${top}px; left: ${left}px; z-index: ${zindex}`
      );
      options.forEach(option => {
        option.classList.add("tilt-in-right-1");
        setTimeout(() => {
          option.classList.remove("tilt-in-right-1");
        }, 400);
      });
    },
    onDragged({ el, deltaX, deltaY, first, last }) {
      if (this.newConect) return;
      let id = el.id.replace("item-", "");
      let body = document.body;
      if (first) {
        this.dragged = true;
        body.style.cursor = "move";
        return;
      }
      if (last) {
        this.dragged = false;
        body.style.cursor = "default";
        return;
      }

      this.$refs.plus.setAttribute(`style`, `display:none;`);
      var l = +window.getComputedStyle(el)["left"].slice(0, -2) || 0;
      var t = +window.getComputedStyle(el)["top"].slice(0, -2) || 0;
      this.data.forEach(function(el) {
        if (el.id == id) {
          el.position = [t + deltaY, l + deltaX];
        }
      });
      sessionStorage.data = JSON.stringify(this.data);
    }
  }
};
</script>
