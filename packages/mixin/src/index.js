const React = require('react');

const inherits = require('utils/lib/inherits');
const mixin = require('utils/lib/mixin');

const ReactMixinPolicy = require('./ReactMixinPolicy');

module.exports = (configs) => {
	const { statics, instantials } = mixinSpecs(configs);

	const ReactMixinClass = class ReactMixinClass {
	};

	Object.assign(ReactMixinClass, statics);
	ReactMixinClass.prototype = instantials;

	inherits(ReactMixinClass, React.Component);

	return ReactMixinClass;
};

module.exports.ReactMixinPolicy = ReactMixinPolicy;

function mixinSpecs(configs) {
	if (isEmpty(configs)) {
		throw new TypeError('expect configs as a non-empty object or array');
	}

	if (Array.isArray(configs)) {
		configs = { mixins: configs };
	}

	const mixins = separateMixins(configs.mixins);
	const policy = separatePolicy(configs.policy);

	const staticSpec = mixin({
		mixins: mixins.statics,
		policy: policy.statics
	});
	const instanceSpec = mixin({
		mixins: mixins.instantials,
		policy: Object.assign({}, policy.instantials, ReactMixinPolicy)
	});

	return { statics: staticSpec, ...instanceSpec };
}

function separateMixins(mixins) {
	return mixins.reduce((ret, mixin) => {
		const { statics, ...instantials } = mixin;
		ret.statics.push(statics);
		ret.instantials.push(instantials);
		return ret;
	}, { statics: [], instantials: [] });
}

function separatePolicy(policy) {
	const { statics, ...instantials } = policy || {};
	return { statics, instantials };
}

function isEmpty(obj) {
	return !(
		Array.isArray(obj) && obj.length > 0 ||
		typeof obj === 'object' && Object.keys(obj).length > 0
	);
}
