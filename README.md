# tc-react-countdown
react 倒计时组件
ui完全自己自定义、支持秒时分天倒计时使用demo

```javascript
<Countdown time={80000} level={0} fn={(data, isend)=> {
                console.log(data);
                if(isend) {
                    alert('over');
                }
                else {
                    return <span>{data[0]}</span>
                }
            }}>
            </Countdown>
```
time 可以传data number arry类型 传data表示结束日期，穿number表示秒，arry 表示【天 时 分 秒，毫秒】

level  0表示都转成秒 1表示转成分 2 时 3天 默认0
fn(data,isend) 每秒回调 data是倒计时数组  isend判断是否结束


