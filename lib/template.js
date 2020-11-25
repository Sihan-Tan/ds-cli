exports.vue = `<template>
    <div class="index">
        {{Index}}
    </div>
</template>
<script>
export default {
    name: 'Index',
    data(){
        return {
            Index: 'Index'
        }
    },
}
</script>
<style lang="less" scoped>

</style>
`;

exports.route = `const holder = [
    {
      path: '/holder',
      name: 'Holder',
      component: () =>
        import(/* webpackChunkName: "Holder" */ '@/views/holder/index.vue'),
    },
];
  
export default holder;
`;

exports.importRoute = (
  name
) => `import ${name} from '@/routes/modules/${name}.js'
// importHolder`;

exports.loadRoute = (name) => `...${name},
    // loadRoute`;

exports.store = `let state = {
  
};
let mutations = {

};
let actions = {
  
};
export default {
  namespace: true,
  state,
  mutations,
  actions
};
`;

exports.importStore = (
  name
) => `import ${name} from '@/store/modules/${name}.js'
// importHolder`;

exports.loadStore = (name) => `${name},
    // loadRoute`;
