## 示例

---

<script setup>
import { ref, h } from "vue";
import ExSector from "@components/sector/ExSector.jsx";

</script>
<div style="width:200px">
<ExSector title="普通的标题" subtitle="有描述" />
<ExSector title="有slot的写法" color="blue">
    <template #subtitle>
        <view style="color: red">红色</view>与蓝色
    </template>
</ExSector>
</div>

```vue
<ExSector title="普通的标题" subtitle="有描述" />
<ExSector title="有slot的写法" color="blue">
    <template #subtitle>
        <view style="color: red">红色</view>与蓝色
    </template>
</ExSector>
```
