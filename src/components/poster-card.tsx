import { component$, QwikIntrinsicElements, type PropFunction } from "@builder.io/qwik";
import { LuPlus, LuXCircle } from "@qwikest/icons/lucide";
import { cn } from "~/lib/utils";
import { Button } from "./button";

type PosterCardProps = QwikIntrinsicElements['input'] & {
    src?: string;
    isAdd?: boolean;
    posterId?: number;
    deletePoster$?: PropFunction<() => void>;
    updatePoster$?: PropFunction<(formData: FormData) => void>;
}

export const PosterCard = component$(({ posterId, src, isAdd, deletePoster$, updatePoster$, ...props }: PosterCardProps) => {
    const { ...posterProps } = props;

    return (
        <div class="flex flex-col gap-3 font-roboto">
            <div class={cn(
                "relative aspect-square rounded-xl overflow-hidden border-2 transition-all group",
                isAdd ? "border-dashed border-custom-neutral-300 hover:border-primary-400 bg-custom-neutral-50 hover:bg-custom-neutral-base" : "border-custom-neutral-200"
            )}>
                {isAdd ? (
                    <label for="upload-poster" class="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer text-custom-neutral-500 group-hover:text-primary-600">
                        <LuPlus class="w-10 h-10" />
                        <span class="text-label-medium font-medium">Tambah Poster</span>
                        <input 
                            {...props}
                            id="upload-poster"
                            type="file" 
                            class="hidden" 
                            accept="image/*"
                            value={undefined}
                        />
                    </label>
                ) : (
                    <img height={1000} width={1000} src={src} alt="Poster" class="w-full h-full object-cover" />
                )}
            </div>

            {!isAdd && (
                <div class="flex gap-2 items-center">
                    <label
                        for={`update-poster-${posterId}`}
                        class="w-full"
                    >
                        <Button
                            variant="secondary"
                            size="small"
                            type="button"
                            fillContainer
                            class="pointer-events-none cursor-pointer"
                        >
                            Ganti Poster
                        </Button>
                    </label>

                    <input 
                        {...posterProps}
                        id={`update-poster-${posterId}`}
                        // id="update-poster"
                        type="file"
                        class="hidden"
                        accept="image/*"
                        value={undefined}
                        onChange$={(e, el) => {
                            const file = el.files?.[0];
                            if (updatePoster$ && file && posterId) {
                                // LANGSUNG buat FormData di sini
                                const formData = new FormData();
                                formData.append("new_gambar", file);
                                formData.append("id", posterId.toString());
                                updatePoster$(formData);
                                
                                // Reset input
                                el.value = '';
                            }
                        }}
                    />
                    
                    <input name="id" type="hidden" value={posterId} />

                    <Button 
                        variant="tertiary"
                        size="small"
                        type="button"
                        onClick$={deletePoster$}
                    >
                        <LuXCircle class="w-7 h-7 text-red-500" />
                    </Button>
                </div>
            )}
        </div>
    );
});