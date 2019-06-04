const MobxDevTool =
  process.env.NODE_ENV === 'development'
    ? require('mobx-react-devtools').default
    : () => null;

export default MobxDevTool;
