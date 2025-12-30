import React, { useState } from 'react';
import { useAppDispatch } from '../hooks';
import { toggleSubTopic } from '../store/topicSlice';
import { FaChevronDown, FaChevronUp, FaEdit, FaTrash } from 'react-icons/fa';

export interface SubTopic {
    _id?: string;
    name: string;
    leetcodeLink: string;
    youtubeLink: string;
    articleLink: string;
    level: 'EASY' | 'MEDIUM' | 'HARD' | string;
    status: string;
    isChecked: boolean;
    // true if user-created subtopic; false/undefined means default
    isCustom?: boolean;
}

export interface Topic {
    _id?: string;
    title: string;
    status: string;
    subTopics: SubTopic[];
    // true if this is a pure default topic coming from master sheet
    isDefault?: boolean;
}

interface TopicAccordionProps {
    topic: Topic;
    topicIndex: number;
    onAddSubtopicClick?: (topic: Topic) => void;
    onEditTopic?: (topic: Topic) => void;
    onDeleteTopic?: (topic: Topic) => void;
    onEditSubtopic?: (topic: Topic, sub: SubTopic, subIndex: number) => void;
    onDeleteSubtopic?: (topic: Topic, sub: SubTopic, subIndex: number) => void;
}

const TopicAccordion: React.FC<TopicAccordionProps> = ({ topic, topicIndex, onAddSubtopicClick, onEditTopic, onDeleteTopic, onEditSubtopic, onDeleteSubtopic }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    // Check if any subtopic is user-created (custom)
    const hasCustomSubtopics = topic.subTopics.some(sub => sub.isCustom);
    // Show Action column if the topic itself is not default OR if it has custom subtopics
    const showActionColumn = !topic.isDefault || hasCustomSubtopics;

    return (
        <div className="mb-3 overflow-hidden rounded bg-cyan-400">
            <div
                className="flex cursor-pointer items-center justify-between px-4 py-3 text-white"
                onClick={toggleAccordion}
            >
                <span className="font-medium">
                    {topic.title}
                    <span className="ml-2 rounded bg-red-600 px-2 py-0.5 text-[10px]">
                        {topic.status}
                    </span>
                </span>
                <div className="flex items-center gap-3">
                    {!topic.isDefault && (
                        <>
                            <button
                                type="button"
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs hover:bg-white/20"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEditTopic && onEditTopic(topic);
                                }}
                            >
                                <FaEdit />
                            </button>
                            <button
                                type="button"
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs hover:bg-white/20"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteTopic && onDeleteTopic(topic);
                                }}
                            >
                                <FaTrash />
                            </button>
                        </>
                    )}
                    <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
                </div>
            </div>
            <div className={`${isOpen ? 'block' : 'hidden'} bg-white px-4 pb-4 pt-3`}>
                <div className="flex justify-between items-center mb-2">
                    <h3>Sub Topics</h3>
                    {onAddSubtopicClick && (
                        <button
                            type="button"
                            className="text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                            style={{ width: 'auto', padding: '6px 12px' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddSubtopicClick(topic);
                            }}
                        >
                            Add Subtopic
                        </button>
                    )}
                </div>
                <table className="mt-2 w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-700">
                            <th className="px-3 py-2">Name</th>
                            <th className="px-3 py-2">LeetCode Link</th>
                            <th className="px-3 py-2">YouTube Link</th>
                            <th className="px-3 py-2">Article Link</th>
                            <th className="px-3 py-2">Level</th>
                            <th className="px-3 py-2">Status</th>
                            {showActionColumn && <th className="px-3 py-2 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {topic.subTopics.map((sub, index) => (
                            <tr key={sub._id ?? index} className="border-b border-gray-100">
                                <td className="px-3 py-2">
                                    <input
                                        type="checkbox"
                                        checked={sub.isChecked}
                                        onChange={() =>
                                            dispatch(
                                                toggleSubTopic({ topicIndex, subIndex: index })
                                            )
                                        }
                                        className="mr-2"
                                    />
                                    {sub.name}
                                </td>
                                <td className="px-3 py-2 text-blue-600 underline"><a href={sub.leetcodeLink} target="_blank" rel="noreferrer">Practice</a></td>
                                <td className="px-3 py-2 text-blue-600 underline"><a href={sub.youtubeLink} target="_blank" rel="noreferrer">Watch</a></td>
                                <td className="px-3 py-2 text-blue-600 underline"><a href={sub.articleLink} target="_blank" rel="noreferrer">Read</a></td>
                                <td className="px-3 py-2">{sub.level}</td>
                                <td className="px-3 py-2">
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs font-medium ${sub.status === 'Done'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-amber-100 text-amber-700'
                                            }`}
                                    >
                                        {sub.status}
                                    </span>
                                </td>
                                {showActionColumn && (
                                    <td className="px-3 py-2 text-right">
                                        {/*
                                          Show edit/delete for any subtopic that is user-created (isCustom !== false),
                                          even if it lives under a default/master topic. Backend still enforces that
                                          only isCustom subtopics can actually be edited/deleted.
                                        */}
                                        {sub.isCustom !== false && (
                                            <>
                                                <button
                                                    type="button"
                                                    className="mr-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-600 hover:bg-gray-200"
                                                    onClick={() => {
                                                        onEditSubtopic && onEditSubtopic(topic, sub, index);
                                                    }}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs hover:bg-white/20"
                                                    onClick={() => {
                                                        onDeleteSubtopic && onDeleteSubtopic(topic, sub, index);
                                                    }}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopicAccordion;
