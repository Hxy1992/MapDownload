import {
  // create naive ui
  create,
  // component
  NMessageProvider,
  NNotificationProvider,
  NButton,
  NIcon,
  NDropdown,
  NDialog,
  NModal,
  NDescriptions,
  NDescriptionsItem,
  NPopover,
  NTree,
} from 'naive-ui';

const naive = create({
  components: [
    NMessageProvider,
    NNotificationProvider,
    NButton,
    NIcon,
    NDropdown,
    NDialog,
    NModal,
    NDescriptions,
    NDescriptionsItem,
    NPopover,
    NTree,
  ],
});

export default naive;
