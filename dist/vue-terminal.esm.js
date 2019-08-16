import VueTerminalUI from '@evlad/vue-terminal-ui';

var clear = {
	name: "CommandClear",
	methods: {
		clear: function clear() {
			this.history = [];
		}
	}
};

var pwd = {
	name: "CommandPwd",
	methods: {
		pwd: function pwd() {
			// console.log(this.findDir(this.workingDir));
			this.write(this.rootHierarchy[0].parent.name);
		}
	}
};

var whoami = {
	name: "CommandWhoami",
	methods: {
		whoami: function whoami(args) {
			if (args.length > 0) { this.write("usage: whoami"); }
			else { this.write(this.user); }
		}
	}
};

var secret = {
	name: "TerminalCommandSecret",
	methods: {
		secret: function secret() {
			this.write("Made with ❤ in London, UK - by @emmanuelvlad");
		}
	}
};

var Commands = {
	//
	// Name
	//
	name: "Commands",

	//
	// Mixins
	//
	mixins: [clear, pwd, whoami, secret],

	//
	// Methods
	//
	methods: {
		execute: function execute(input) {
			var args = input.trim().split(" ");
			if (!args[0]) { return; }

			if (typeof this[args[0]] === "function") { this[args[0]](args.slice(1)); }
			else { this.write(("sh: " + (args[0]) + ": command not found"), false); }
		}
	}
};

var Directory = {
	//
	// Name
	//
	name: "Directory",

	//
	// Data
	//
	data: function data() {
		return {
			currentDir: {},
			workingDir: "/",
			rootHierarchy: [
				{
					name: "root",
					directory: [
						{
							name: "hello.txt",
							permissions: 777,
							content: "hello"
						}
					],
					permissions: 777,
				}
			]
		};
	},

	//
	// Methods
	//
	methods: {

		cleanPath: function cleanPath(path) {
			return path.replace(/\/{2,}/, "/");
		},

		findDir: function findDir(raw) {
			var path = this.cleanPath(raw);
			var fromRoot = (path[0] === "/") ? true : false;
			var split = path.substring((fromRoot) ? 1 : 0, path.length).split("/");
			var index = 0;
			var find = (fromRoot) ? this.rootHierarchy : this.currentDir;

			for (; split.length > index; index++) {
				var next = find.find(function (el) { return el.name === split[index] && el.directory instanceof Array; });
				if (next && next.directory && (find = next.directory)) { continue; }
				else if (fromRoot && split.length === 1) { continue; }
				else { break; }
			}

			return (split.length === index) ? find : (split.length === 1 && fromRoot) ? true : false;
		},

		changeDir: function changeDir(str) {
			var dir = this.findDir(str);

			if (dir) { this.currentDir = dir; }
			else { return false; }
			var fromRoot = (str[0] === "/") ? true : false;

			var split = str.split("/");

			split.forEach();
		},

		applyParent: function applyParent(parent) {
			for (var i = 0; parent.length > i; i++) {
				parent[i].parent = parent;
				if (parent[i].directory) { parent[i] = this.applyParent(parent[i]); }
			}
			return parent;
		}
	},

	//
	// Created
	//
	created: function created() {
		this.rootHierarchy = this.applyParent(this.rootHierarchy);
		this.currentDir = this.rootHierarchy;
	}
};

//

var script = {
	//
	// Name
	//
	name: "VueTerminal",

	mixins: [Commands, Directory],

	//
	// Components
	//
	components: {
		"vue-terminal-ui": VueTerminalUI
	},

	//
	// Props
	//
	props: {
		prefix: {
			type: String,
			default: ""
		},

		user: {
			type: String,
			default: "root"
		}
	},

	//
	// Methods
	//
	methods: {

		execute: function execute(command) {
			if (command === "test") {
				this.prefix = "hello@root:";
			}
			// TODO: do all the command execution
		},

	},
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("vue-terminal-ui", {
    ref: "terminal-ui",
    attrs: { prefix: _vm.prefix },
    on: { triggerCommand: _vm.execute }
  })
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = undefined;
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var VueTerminal = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

export default VueTerminal;
