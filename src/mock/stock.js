import Mock from 'mockjs';
import { param2Obj } from 'utils';

const List = [];
const count = 116;

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        id: '@increment',
        timestamp: +Mock.Random.date('T'),
        author: '@cname',
        auditor: '@cname',
        title: '@ctitle(10, 20)',
        forecast: '@float(0, 100, 2, 2)',
        importance: '@integer(1, 3)',
        'type|1': ['CN', 'US', 'JP', 'EU'],
        'status|1': ['published', 'draft', 'deleted'],
        display_time: '@datetime',
        pageviews: '@integer(300, 5000)'
    }));
}

export default {
    list: config => {
        const { importance, type, title, page, limit, sort } = param2Obj(config.url);
        let mockList = List.filter(item => {
            if (importance && item.importance !== +importance) return false;
            if (type && item.type !== type) return false;
            if (title && item.title.indexOf(title) < 0) return false;
            return true;
        });
        if (sort === '-id') {
            mockList = mockList.reverse()
        }

        const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1));

        return {
            code: 20000,
            data: {
                total: mockList.length,
                items: pageList
            }
        }
    },
    pvlist: config => {
        pvData: [{ key: 'PC网站', pv: 1024 }, { key: 'mobile网站', pv: 1024 }, { key: 'ios', pv: 1024 }, { key: 'android', pv: 1024 }]

        return {
            code: 20000,
            data: pvData
        }
    }
};
