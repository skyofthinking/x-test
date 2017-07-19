import Mock from 'mockjs';
import login_api from './login';
import article_api from './article';
import user_api from './user';

Mock.mock(/\/user\/login/, 'post', login_api.login);
Mock.mock(/\/user\/info\.*/, 'get', login_api.getInfo)
Mock.mock(/\/user\/logout/, 'post', login_api.logout);

// 文章相关
Mock.mock(/\/table\/list/, 'get', article_api.getList);

// 用户
Mock.mock(/\/user\/list/, 'get', user_api.getList);
Mock.mock(/\/userex\/list/, 'get', user_api.getExList);
Mock.mock(/\/userex\/pv/, 'get', user_api.getExPv);

export default Mock;