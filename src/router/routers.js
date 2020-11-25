import error from './error';
import passport from './passport';
import events from './events';
import personnel from './personnel';
import information from './information';
import system from './system';
import organization from './organization';
import home from './home';
import account from './account';
import mall from './mall';

export default [
    home,
    mall,
    events,
    ...error,
    ...passport,
    personnel,
    information,
    organization,
    system,
    account,
];
