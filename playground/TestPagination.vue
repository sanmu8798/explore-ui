<template>
	<ExPagination
		url="api/worker/maintenance"
		:extra-data="{ state: 'accepted' }"
		single-page
		:search-fixed="false"
		auto-load
		:search="{ ...searchData }"
		persistence
	>
		<!--		<template #prepend>
          <div>bbbbb</div>
          aaaaa
        </template>-->
		<template #renderItem="{ item }">
			<p style="margin-bottom: 30px; margin-top: 0">{{ item.content }}</p>
			<p style="margin-bottom: 30px; margin-top: 0">{{ item.content }}</p>
			<p style="margin-bottom: 30px; margin-top: 0">{{ item.content }}</p>
			<p style="margin-bottom: 30px; margin-top: 0">{{ item.content }}</p>
		</template>
	</ExPagination>
</template>

<script setup>
import { reactive } from "vue"
import ExPagination from "../components/pagination/ExPagination.jsx"
import { computed } from "vue"

const state = reactive({
	options: [],
})

const columns = computed(() => [
	{
		key: "college",
		type: "select",
		title: "学院",
		quick: true,
		options: state.options,
	},
	{
		title: "举办时间",
		type: "datetime",
		key: "starttime",
		condition: "include",
	},
	{
		key: "college1",
		type: "select",
		title: "学院",
		expandable: "multiple",
		options: [
			{ text: "信息学院", value: "12" },
			{ text: "会计学院", value: "13" },
		],
	},
	{
		key: "age",
		title: "年龄",
	},
	{
		key: "gender",
		type: "select",
		title: "性别",
		expandable: true,
		options: [
			{ text: "男", value: "man" },
			{ text: "女", value: "female" },
		],
	},
	{
		key: "cascade",
		title: "级联选择器",
		type: "cascade",
		quick: true,
		options: [
			{
				label: "水类维修",
				text: "水类维修",
				value: 19,
				children: [
					{
						label: "花洒维修",
						text: "花洒维修",
						value: 20,
						children: [
							{
								label: "浴室花洒头坏",
								text: "浴室花洒头坏",
								value: 21,
							},
							{
								label: "浴室花洒管坏",
								text: "浴室花洒管坏",
								value: 22,
							},
							{
								label: "浴室花洒架坏",
								text: "浴室花洒架坏",
								value: 23,
							},
						],
					},
					{
						label: "水龙头维修",
						text: "水龙头维修",
						value: 24,
						children: [
							{
								label: "浴室冷热水龙头坏",
								text: "浴室冷热水龙头坏",
								value: 25,
							},
							{
								label: "卫生间水龙头坏",
								text: "卫生间水龙头坏",
								value: 26,
							},
							{
								label: "阳台水龙头坏",
								text: "阳台水龙头坏",
								value: 27,
							},
							{
								label: "厨房水龙头坏",
								text: "厨房水龙头坏",
								value: 28,
							},
							{
								label: "公共区域水龙头坏",
								text: "公共区域水龙头坏",
								value: 29,
							},
							{
								label: "各类水龙头断裂漏水（急修）",
								text: "各类水龙头断裂漏水（急修）",
								value: 30,
							},
						],
					},
					{
						label: "进水管维修",
						text: "进水管维修",
						value: 31,
						children: [
							{
								label: "教师洗衣机进水管坏",
								text: "教师洗衣机进水管坏",
								value: 32,
							},
							{
								label: "浴室水管坏",
								text: "浴室水管坏",
								value: 33,
							},
							{
								label: "卫生间水管坏",
								text: "卫生间水管坏",
								value: 34,
							},
							{
								label: "阳台水管坏",
								text: "阳台水管坏",
								value: 35,
							},
							{
								label: "公共区域水管坏",
								text: "公共区域水管坏",
								value: 36,
							},
							{
								label: "各类水管漏水（急修）",
								text: "各类水管漏水（急修）",
								value: 37,
							},
							{
								label: "楼栋主水管阀门故障（急修）",
								text: "楼栋主水管阀门故障（急修）",
								value: 38,
							},
						],
					},
					{
						label: "排水管维修",
						text: "排水管维修",
						value: 39,
						children: [
							{
								label: "教师洗衣机排水堵塞",
								text: "教师洗衣机排水堵塞",
								value: 40,
							},
							{
								label: "浴室排水管坏",
								text: "浴室排水管坏",
								value: 41,
							},
							{
								label: "卫生间地板排水管坏",
								text: "卫生间地板排水管坏",
								value: 42,
							},
							{
								label: "阳台地板排水管坏",
								text: "阳台地板排水管坏",
								value: 43,
							},
							{
								label: "浴室天花上方排水管坏",
								text: "浴室天花上方排水管坏",
								value: 44,
							},
							{
								label: "卫生间洗手台下排水管坏",
								text: "卫生间洗手台下排水管坏",
								value: 45,
							},
							{
								label: "卫生间天花上方排水管坏",
								text: "卫生间天花上方排水管坏",
								value: 46,
							},
							{
								label: "阳台洗手台排水管坏",
								text: "阳台洗手台排水管坏",
								value: 47,
							},
							{
								label: "阳台上方排水管坏",
								text: "阳台上方排水管坏",
								value: 48,
							},
							{
								label: "走廊排水口堵塞",
								text: "走廊排水口堵塞",
								value: 49,
							},
							{
								label: "公共区域卫生间洗手盆排水管坏",
								text: "公共区域卫生间洗手盆排水管坏",
								value: 50,
							},
						],
					},
					{
						label: "洗手盆维修",
						text: "洗手盆维修",
						value: 51,
						children: [
							{
								label: "卫生间洗手盆坏",
								text: "卫生间洗手盆坏",
								value: 52,
							},
							{
								label: "阳台洗手盆坏",
								text: "阳台洗手盆坏",
								value: 53,
							},
							{
								label: "厨房洗菜盆坏",
								text: "厨房洗菜盆坏",
								value: 54,
							},
							{
								label: "厨房台板坏",
								text: "厨房台板坏",
								value: 55,
							},
							{
								label: "公共区域洗手盆坏",
								text: "公共区域洗手盆坏",
								value: 56,
							},
						],
					},
					{
						label: "冲水阀和厕盆问题",
						text: "冲水阀和厕盆问题",
						value: 57,
						children: [
							{
								label: "卫生间冲水管/阀坏（急修）",
								text: "卫生间冲水管/阀坏（急修）",
								value: 58,
							},
							{
								label: "卫生间排水堵塞（急修）",
								text: "卫生间排水堵塞（急修）",
								value: 59,
							},
							{
								label: "卫生间厕盆坏",
								text: "卫生间厕盆坏",
								value: 60,
							},
							{
								label: "公共卫生间冲水管/阀坏（急修）",
								text: "公共卫生间冲水管/阀坏（急修）",
								value: 61,
							},
							{
								label: "公共卫生间排水堵塞（急修）",
								text: "公共卫生间排水堵塞（急修）",
								value: 62,
							},
							{
								label: "公共卫生间便池坏",
								text: "公共卫生间便池坏",
								value: 63,
							},
						],
					},
				],
			},
			{
				label: "电类维修",
				text: "电类维修",
				value: 64,
				children: [
					{
						label: "灯具维修",
						text: "灯具维修",
						value: 65,
						children: [
							{
								label: "浴室灯坏（急修）",
								text: "浴室灯坏（急修）",
								value: 66,
							},
							{
								label: "卫生间灯坏",
								text: "卫生间灯坏",
								value: 67,
							},
							{ label: "房间灯坏", text: "房间灯坏", value: 68 },
							{ label: "阳台灯坏", text: "阳台灯坏", value: 69 },
							{ label: "厨房灯坏", text: "厨房灯坏", value: 70 },
							{ label: "楼梯灯坏", text: "楼梯灯坏", value: 71 },
							{ label: "走廊灯坏", text: "走廊灯坏", value: 72 },
							{
								label: "教室、办公室灯坏",
								text: "教室、办公室灯坏",
								value: 73,
							},
							{ label: "灯管脱落", text: "灯管脱落", value: 74 },
							{
								label: "高杆灯故障",
								text: "高杆灯故障",
								value: 75,
							},
							{
								label: "路灯灯杆坍塌（急修）",
								text: "路灯灯杆坍塌（急修）",
								value: 76,
							},
						],
					},
					{
						label: "开关维修",
						text: "开关维修",
						value: 77,
						children: [
							{
								label: "浴室灯开关坏",
								text: "浴室灯开关坏",
								value: 78,
							},
							{
								label: "卫生间灯开关坏",
								text: "卫生间灯开关坏",
								value: 79,
							},
							{
								label: "房间灯管开关坏",
								text: "房间灯管开关坏",
								value: 80,
							},
							{
								label: "浴室排气扇开关坏",
								text: "浴室排气扇开关坏",
								value: 81,
							},
							{
								label: "厕所排气扇开关坏",
								text: "厕所排气扇开关坏",
								value: 82,
							},
							{
								label: "房间风扇开关坏",
								text: "房间风扇开关坏",
								value: 83,
							},
							{
								label: "阳台灯开关坏",
								text: "阳台灯开关坏",
								value: 84,
							},
							{
								label: "厨房灯开关坏",
								text: "厨房灯开关坏",
								value: 85,
							},
							{
								label: "公共区域灯管开关坏",
								text: "公共区域灯管开关坏",
								value: 86,
							},
							{
								label: "公共区域卫生间灯开关坏",
								text: "公共区域卫生间灯开关坏",
								value: 87,
							},
							{
								label: "楼梯灯开关坏",
								text: "楼梯灯开关坏",
								value: 88,
							},
							{
								label: "走廊灯开关坏",
								text: "走廊灯开关坏",
								value: 89,
							},
							{
								label: "楼栋、楼层总开关故障（急修）",
								text: "楼栋、楼层总开关故障（急修）",
								value: 90,
							},
							{
								label: "热水系统控制系统开关故障（急修）",
								text: "热水系统控制系统开关故障（急修）",
								value: 91,
							},
						],
					},
					{
						label: "插座维修",
						text: "插座维修",
						value: 92,
						children: [
							{
								label: "房间插座坏",
								text: "房间插座坏",
								value: 93,
							},
							{
								label: "浴室热水卡机插座坏",
								text: "浴室热水卡机插座坏",
								value: 94,
							},
							{
								label: "房间空调插座坏",
								text: "房间空调插座坏",
								value: 95,
							},
							{
								label: "阳台插座坏",
								text: "阳台插座坏",
								value: 96,
							},
							{
								label: "教室、办公室插座坏",
								text: "教室、办公室插座坏",
								value: 97,
							},
							{ label: "厨房插座坏", text: "厨房插座坏", value: 98 },
						],
					},
					{
						label: "风扇和排气扇维修",
						text: "风扇和排气扇维修",
						value: 99,
						children: [
							{
								label: "房间吸顶扇坏",
								text: "房间吸顶扇坏",
								value: 100,
							},
							{
								label: "卫生间排气扇坏",
								text: "卫生间排气扇坏",
								value: 101,
							},
							{
								label: "浴室排气扇坏",
								text: "浴室排气扇坏",
								value: 102,
							},
							{
								label: "厨房排气扇坏",
								text: "厨房排气扇坏",
								value: 103,
							},
							{
								label: "教室吸顶扇坏",
								text: "教室吸顶扇坏",
								value: 104,
							},
							{
								label: "教室吊扇坏",
								text: "教室吊扇坏",
								value: 105,
							},
							{
								label: "风扇脱落（急修）",
								text: "风扇脱落（急修）",
								value: 106,
							},
						],
					},
					{
						label: "电箱和线路保护盒维修",
						text: "电箱和线路保护盒维修",
						value: 107,
						children: [
							{
								label: "浴室线路保护盒坏",
								text: "浴室线路保护盒坏",
								value: 108,
							},
							{
								label: "房间电箱坏",
								text: "房间电箱坏",
								value: 109,
							},
							{
								label: "房间电线保护盒坏",
								text: "房间电线保护盒坏",
								value: 110,
							},
							{
								label: "教室电箱坏",
								text: "教室电箱坏",
								value: 111,
							},
							{
								label: "用户电表后线路短路（急修）",
								text: "用户电表后线路短路（急修）",
								value: 112,
							},
							{
								label: "电表故障（急修）",
								text: "电表故障（急修）",
								value: 113,
							},
						],
					},
				],
			},
			{
				label: "门窗维修",
				text: "门窗维修",
				value: 114,
				children: [
					{
						label: "门维修",
						text: "门维修",
						value: 115,
						children: [
							{ label: "浴室门坏", text: "浴室门坏", value: 116 },
							{ label: "厕所门坏", text: "厕所门坏", value: 117 },
							{
								label: "阳台玻璃门破裂",
								text: "阳台玻璃门破裂",
								value: 118,
							},
							{
								label: "楼栋入户门坏",
								text: "楼栋入户门坏",
								value: 119,
							},
							{ label: "房间门坏", text: "房间门坏", value: 120 },
							{ label: "防盗门坏", text: "防盗门坏", value: 121 },
							{ label: "天台门坏", text: "天台门坏", value: 122 },
							{ label: "纱门坏", text: "纱门坏", value: 123 },
							{ label: "厨房门坏", text: "厨房门坏", value: 124 },
							{
								label: "各类门锁故障（急修）",
								text: "各类门锁故障（急修）",
								value: 125,
							},
						],
					},
					{
						label: "窗户维修",
						text: "窗户维修",
						value: 126,
						children: [
							{ label: "窗帘坏", text: "窗帘坏", value: 127 },
							{ label: "纱窗坏", text: "纱窗坏", value: 128 },
							{ label: "浴室窗坏", text: "浴室窗坏", value: 129 },
							{
								label: "阳台防盗网坏",
								text: "阳台防盗网坏",
								value: 130,
							},
							{
								label: "房间门上窗户坏",
								text: "房间门上窗户坏",
								value: 131,
							},
							{
								label: "房间窗户坏",
								text: "房间窗户坏",
								value: 132,
							},
							{
								label: "楼梯窗户坏",
								text: "楼梯窗户坏",
								value: 133,
							},
							{
								label: "厨房窗户坏",
								text: "厨房窗户坏",
								value: 134,
							},
							{
								label: "教室窗户坏",
								text: "教室窗户坏",
								value: 135,
							},
							{
								label: "公共区域卫生间窗户坏",
								text: "公共区域卫生间窗户坏",
								value: 136,
							},
						],
					},
				],
			},
			{
				label: "家具维修",
				text: "家具维修",
				value: 137,
				children: [
					{
						label: "柜子维修",
						text: "柜子维修",
						value: 138,
						children: [
							{ label: "结构松动", text: "结构松动", value: 139 },
							{ label: "柜门松动", text: "柜门松动", value: 140 },
							{ label: "虫蛀", text: "虫蛀", value: 141 },
							{
								label: "拉手或合页坏",
								text: "拉手或合页坏",
								value: 142,
							},
							{
								label: "各类板损坏",
								text: "各类板损坏",
								value: 143,
							},
						],
					},
					{
						label: "办公桌维修",
						text: "办公桌维修",
						value: 144,
						children: [
							{
								label: "结构松动松动",
								text: "结构松动松动",
								value: 145,
							},
							{ label: "键盘托坏", text: "键盘托坏", value: 146 },
							{
								label: "键盘导轨坏",
								text: "键盘导轨坏",
								value: 147,
							},
							{
								label: "拉手或合页坏",
								text: "拉手或合页坏",
								value: 148,
							},
							{
								label: "各类板损坏",
								text: "各类板损坏",
								value: 149,
							},
						],
					},
					{
						label: "木床架维修",
						text: "木床架维修",
						value: 150,
						children: [
							{ label: "床架松动", text: "床架松动", value: 151 },
							{ label: "床板断裂", text: "床板断裂", value: 152 },
							{ label: "床板松动", text: "床板松动", value: 153 },
							{ label: "床梯松动", text: "床梯松动", value: 154 },
						],
					},
					{
						label: "椅子和蚊帐架维修",
						text: "椅子和蚊帐架维修",
						value: 155,
						children: [
							{ label: "椅子缺失", text: "椅子缺失", value: 156 },
							{
								label: "椅子铁架损坏",
								text: "椅子铁架损坏",
								value: 157,
							},
							{
								label: "椅子板损坏",
								text: "椅子板损坏",
								value: 158,
							},
							{ label: "背板损坏", text: "背板损坏", value: 159 },
							{
								label: "蚊帐架缺失",
								text: "蚊帐架缺失",
								value: 160,
							},
							{
								label: "蚊帐架损坏",
								text: "蚊帐架损坏",
								value: 161,
							},
						],
					},
					{
						label: "书架维修",
						text: "书架维修",
						value: 162,
						children: [
							{ label: "书架松动", text: "书架松动", value: 163 },
							{
								label: "各类板损坏",
								text: "各类板损坏",
								value: 164,
							},
						],
					},
					{
						label: "办公椅维修",
						text: "办公椅维修",
						value: 165,
						children: [
							{ label: "坐板坏", text: "坐板坏", value: 166 },
							{ label: "背板坏", text: "背板坏", value: 167 },
							{ label: "升降坏", text: "升降坏", value: 168 },
							{ label: "扶手坏", text: "扶手坏", value: 169 },
						],
					},
					{
						label: "教室课桌椅维修",
						text: "教室课桌椅维修",
						value: 170,
						children: [
							{
								label: "实木课桌椅维修",
								text: "实木课桌椅维修",
								value: 171,
							},
							{
								label: "吹塑课桌椅维修",
								text: "吹塑课桌椅维修",
								value: 172,
							},
						],
					},
					{
						label: "讲台、吧椅维修",
						text: "讲台、吧椅维修",
						value: 173,
						children: [
							{
								label: "讲台结构松动",
								text: "讲台结构松动",
								value: 174,
							},
							{ label: "键盘托坏", text: "键盘托坏", value: 175 },
							{
								label: "键盘导轨坏",
								text: "键盘导轨坏",
								value: 176,
							},
							{ label: "讲台板坏", text: "讲台板坏", value: 177 },
							{
								label: "讲台椅坐板坏",
								text: "讲台椅坐板坏",
								value: 178,
							},
							{
								label: "讲台椅背板坏",
								text: "讲台椅背板坏",
								value: 179,
							},
							{
								label: "讲台椅升降坏",
								text: "讲台椅升降坏",
								value: 180,
							},
							{
								label: "讲台椅子椅脚坏",
								text: "讲台椅子椅脚坏",
								value: 181,
							},
						],
					},
					{
						label: "礼堂椅、卡座、文件柜",
						text: "礼堂椅、卡座、文件柜",
						value: 182,
						children: [
							{ label: "礼堂椅坏", text: "礼堂椅坏", value: 183 },
							{ label: "卡座损坏", text: "卡座损坏", value: 184 },
							{
								label: "文件柜锁坏",
								text: "文件柜锁坏",
								value: 185,
							},
						],
					},
					{ label: "其他", text: "其他", value: 186 },
				],
			},
			{
				label: "电器维修",
				text: "电器维修",
				value: 187,
				children: [
					{
						label: "空调维修",
						text: "空调维修",
						value: 188,
						children: [{ label: "空调维修", text: "空调维修", value: 189 }],
					},
					{
						label: "洗衣机维修（教师宿舍）",
						text: "洗衣机维修（教师宿舍）",
						value: 190,
						children: [
							{
								label: "洗衣机维修",
								text: "洗衣机维修",
								value: 191,
							},
						],
					},
					{
						label: "热水器维修",
						text: "热水器维修",
						value: 192,
						children: [
							{
								label: "热水器维修",
								text: "热水器维修",
								value: 193,
							},
						],
					},
					{
						label: "电视机维修",
						text: "电视机维修",
						value: 194,
						children: [
							{
								label: "电视机维修",
								text: "电视机维修",
								value: 195,
							},
						],
					},
					{
						label: "燃气灶维修",
						text: "燃气灶维修",
						value: 196,
						children: [
							{
								label: "燃气灶维修",
								text: "燃气灶维修",
								value: 197,
							},
						],
					},
					{
						label: "抽油烟器维修",
						text: "抽油烟器维修",
						value: 198,
						children: [
							{
								label: "抽油烟器维修",
								text: "抽油烟器维修",
								value: 199,
							},
						],
					},
					{
						label: "落地扇维修",
						text: "落地扇维修",
						value: 200,
						children: [
							{
								label: "落地扇维修",
								text: "落地扇维修",
								value: 201,
							},
						],
					},
					{
						label: "电冰箱维修",
						text: "电冰箱维修",
						value: 202,
						children: [
							{
								label: "电冰箱维修",
								text: "电冰箱维修",
								value: 203,
							},
						],
					},
					{
						label: "微波炉维修",
						text: "微波炉维修",
						value: 204,
						children: [
							{
								label: "微波炉维修",
								text: "微波炉维修",
								value: 205,
							},
						],
					},
					{
						label: "房间饮水机维修",
						text: "房间饮水机维修",
						value: 206,
						children: [
							{
								label: "房间饮水机维修",
								text: "房间饮水机维修",
								value: 207,
							},
						],
					},
				],
			},
			{
				label: "建筑结构",
				text: "建筑结构",
				value: 208,
				children: [
					{
						label: "天花开裂",
						text: "天花开裂",
						value: 209,
						children: [{ label: "天花开裂", text: "天花开裂", value: 210 }],
					},
					{
						label: "房屋漏水",
						text: "房屋漏水",
						value: 211,
						children: [{ label: "房屋漏水", text: "房屋漏水", value: 212 }],
					},
					{
						label: "房屋渗水",
						text: "房屋渗水",
						value: 213,
						children: [{ label: "房屋渗水", text: "房屋渗水", value: 214 }],
					},
					{
						label: "墙皮掉灰、发霉",
						text: "墙皮掉灰、发霉",
						value: 215,
						children: [
							{
								label: "墙皮掉灰、发霉",
								text: "墙皮掉灰、发霉",
								value: 216,
							},
						],
					},
					{
						label: "地板下陷",
						text: "地板下陷",
						value: 217,
						children: [{ label: "地板下陷", text: "地板下陷", value: 218 }],
					},
					{
						label: "瓷砖脱落",
						text: "瓷砖脱落",
						value: 219,
						children: [{ label: "瓷砖脱落", text: "瓷砖脱落", value: 220 }],
					},
					{
						label: "天面水管问题",
						text: "天面水管问题",
						value: 221,
						children: [
							{
								label: "天面水管问题",
								text: "天面水管问题",
								value: 222,
							},
						],
					},
					{
						label: "其他问题（请认真表述）",
						text: "其他问题（请认真表述）",
						value: 225,
						children: [
							{
								label: "其他问题（请认真表述）",
								text: "其他问题（请认真表述）",
								value: 226,
							},
						],
					},
				],
			},
			{
				label: "四害消杀",
				text: "四害消杀",
				value: 227,
				children: [
					{
						label: "红火蚁消杀",
						text: "红火蚁消杀",
						value: 228,
						children: [
							{
								label: "红火蚁消杀",
								text: "红火蚁消杀",
								value: 229,
							},
						],
					},
					{
						label: "老鼠消杀",
						text: "老鼠消杀",
						value: 230,
						children: [{ label: "老鼠消杀", text: "老鼠消杀", value: 231 }],
					},
					{
						label: "白蚁消杀",
						text: "白蚁消杀",
						value: 232,
						children: [{ label: "白蚁消杀", text: "白蚁消杀", value: 233 }],
					},
					{
						label: "蛇消杀",
						text: "蛇消杀",
						value: 234,
						children: [{ label: "蛇消杀", text: "蛇消杀", value: 235 }],
					},
					{
						label: "黄蜂消杀",
						text: "黄蜂消杀",
						value: 236,
						children: [{ label: "黄蜂消杀", text: "黄蜂消杀", value: 237 }],
					},
				],
			},
			{
				label: "热水系统",
				text: "热水系统",
				value: 238,
				children: [
					{
						label: "热泵坏",
						text: "热泵坏",
						value: 239,
						children: [{ label: "热泵坏", text: "热泵坏", value: 240 }],
					},
					{
						label: "热水卡机故障",
						text: "热水卡机故障",
						value: 241,
						children: [
							{
								label: "热水卡机故障",
								text: "热水卡机故障",
								value: 242,
							},
						],
					},
					{
						label: "公共热水管问题",
						text: "公共热水管问题",
						value: 243,
						children: [
							{
								label: "公共热水管问题（急修）",
								text: "公共热水管问题（急修）",
								value: 244,
							},
						],
					},
				],
			},
			{
				label: "公共设施及其他",
				text: "公共设施及其他",
				value: 245,
				children: [
					{ label: "路灯坏", text: "路灯坏", value: 246 },
					{
						label: "安全指示灯坏",
						text: "安全指示灯坏",
						value: 247,
						children: [
							{
								label: "安全指示灯坏",
								text: "安全指示灯坏",
								value: 248,
							},
						],
					},
					{
						label: "应急灯坏",
						text: "应急灯坏",
						value: 249,
						children: [{ label: "应急灯坏", text: "应急灯坏", value: 250 }],
					},
					{
						label: "消防栓坏",
						text: "消防栓坏",
						value: 251,
						children: [{ label: "消防栓坏", text: "消防栓坏", value: 252 }],
					},
					{
						label: "沙井盖坏",
						text: "沙井盖坏",
						value: 253,
						children: [{ label: "沙井盖坏", text: "沙井盖坏", value: 254 }],
					},
					{
						label: "体育设施坏",
						text: "体育设施坏",
						value: 255,
						children: [
							{
								label: "体育设施坏",
								text: "体育设施坏",
								value: 256,
							},
						],
					},
					{
						label: "路面坏",
						text: "路面坏",
						value: 257,
						children: [{ label: "路面坏", text: "路面坏", value: 258 }],
					},
					{
						label: "其他问题（请认真表述）",
						text: "其他问题（请认真表述）",
						value: 259,
						children: [
							{
								label: "其他问题（请认真表述）",
								text: "其他问题（请认真表述）",
								value: 260,
							},
						],
					},
				],
			},
			{
				label: "生活配件",
				text: "生活配件",
				value: 261,
				children: [
					{
						label: "镜子坏",
						text: "镜子坏",
						value: 262,
						children: [{ label: "镜子坏", text: "镜子坏", value: 263 }],
					},
					{
						label: "晾衣架，晾衣链坏",
						text: "晾衣架，晾衣链坏",
						value: 264,
						children: [
							{
								label: "晾衣架，晾衣链坏",
								text: "晾衣架，晾衣链坏",
								value: 265,
							},
						],
					},
					{
						label: "毛巾架坏",
						text: "毛巾架坏",
						value: 266,
						children: [{ label: "毛巾架坏", text: "毛巾架坏", value: 267 }],
					},
					{
						label: "挂衣钩坏",
						text: "挂衣钩坏",
						value: 268,
						children: [{ label: "挂衣钩坏", text: "挂衣钩坏", value: 269 }],
					},
					{
						label: "窗帘支架坏",
						text: "窗帘支架坏",
						value: 270,
						children: [
							{
								label: "窗帘支架坏",
								text: "窗帘支架坏",
								value: 271,
							},
						],
					},
					{
						label: "置物架坏",
						text: "置物架坏",
						value: 272,
						children: [{ label: "置物架坏", text: "置物架坏", value: 273 }],
					},
					{
						label: "黑板坏",
						text: "黑板坏",
						value: 274,
						children: [{ label: "黑板坏", text: "黑板坏", value: 275 }],
					},
					{
						label: "防护栏坏",
						text: "防护栏坏",
						value: 276,
						children: [{ label: "防护栏坏", text: "防护栏坏", value: 277 }],
					},
				],
			},
			{ label: "其他", text: "其他", value: 278 },
		],
	},
])

const searchData = computed(() => {
	return {
		keyword: "title",
		modelValue: "aaaaaa",
		columns: columns.value,
		adapter: "newbie",
	}
})

setTimeout(() => {
	state.options = [
		{ text: "信息学院", value: "12" },
		{ text: "会计学院", value: "13" },
	]
}, 1000)
</script>
